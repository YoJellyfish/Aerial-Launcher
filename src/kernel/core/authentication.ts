import type { AuthorizationError } from '../../types/services/authorizations'
import type { AccountData, AccountDataRecord } from '../../types/accounts'
import type { AuthenticationByDeviceProperties } from '../../types/authentication'

import { BrowserWindow } from 'electron'

import { ElectronAPIEventKeys } from '../../config/constants/main-process'

import { AccountsManager } from '../startup/accounts'
import { DataDirectory } from '../startup/data-directory'

import {
  createDeviceAuthCredentials,
  getAccessTokenUsingAuthorizationCode,
  getAccessTokenUsingDeviceAuth,
  getAccessTokenUsingExchangeCode,
} from '../../services/endpoints/oauth'

export class Authentication {
  static async authorization(currentWindow: BrowserWindow, code: string) {
    try {
      const responseExchange =
        await getAccessTokenUsingAuthorizationCode(code)
      const responseDevice =
        await Authentication.generateDeviceAuthCredencials(
          currentWindow,
          ElectronAPIEventKeys.ResponseAuthWithAuthorization,
          {
            accessToken: responseExchange.data.access_token,
            accountId: responseExchange.data.account_id,
          }
        )

      if (responseDevice) {
        await Authentication.registerAccount(
          currentWindow,
          ElectronAPIEventKeys.ResponseAuthWithAuthorization,
          {
            accessToken: responseExchange.data.access_token,
            accountId: responseExchange.data.account_id,
            deviceId: responseDevice.deviceId,
            displayName: responseExchange.data.displayName,
            secret: responseDevice.secret,
          }
        )
      }
    } catch (error) {
      Authentication.responseError({
        currentWindow,
        key: ElectronAPIEventKeys.ResponseAuthWithAuthorization,
        error,
      })
    }
  }

  static async device(
    currentWindow: BrowserWindow,
    data: AuthenticationByDeviceProperties
  ) {
    try {
      const responseExchange = await getAccessTokenUsingDeviceAuth(data)

      await Authentication.registerAccount(
        currentWindow,
        ElectronAPIEventKeys.ResponseAuthWithDevice,
        {
          accessToken: responseExchange.data.access_token,
          accountId: responseExchange.data.account_id,
          deviceId: data.deviceId,
          displayName: responseExchange.data.displayName,
          secret: data.secret,
        }
      )
    } catch (error) {
      Authentication.responseError({
        currentWindow,
        key: ElectronAPIEventKeys.ResponseAuthWithDevice,
        error,
      })
    }
  }

  static async exchange(currentWindow: BrowserWindow, code: string) {
    try {
      const responseExchange = await getAccessTokenUsingExchangeCode(code)
      const responseDevice =
        await Authentication.generateDeviceAuthCredencials(
          currentWindow,
          ElectronAPIEventKeys.ResponseAuthWithExchange,
          {
            accessToken: responseExchange.data.access_token,
            accountId: responseExchange.data.account_id,
          }
        )

      if (responseDevice) {
        await Authentication.registerAccount(
          currentWindow,
          ElectronAPIEventKeys.ResponseAuthWithExchange,
          {
            accessToken: responseExchange.data.access_token,
            accountId: responseExchange.data.account_id,
            deviceId: responseDevice.deviceId,
            displayName: responseExchange.data.displayName,
            secret: responseDevice.secret,
          }
        )
      }
    } catch (error) {
      Authentication.responseError({
        currentWindow,
        key: ElectronAPIEventKeys.ResponseAuthWithExchange,
        error,
      })
    }
  }

  private static async registerAccount(
    currentWindow: BrowserWindow,
    eventKey: ElectronAPIEventKeys,
    data: {
      accessToken: string
      accountId: string
      deviceId: string
      displayName: string
      secret: string
    }
  ) {
    const { accountId, deviceId, displayName, secret } = data
    const newData: AccountData = {
      accountId,
      deviceId,
      displayName,
      secret,
      provider: undefined,
      token: undefined,
    }

    await AccountsManager.add({
      accountId,
      deviceId,
      displayName,
      secret,
    })

    const { accounts } = await DataDirectory.getAccountsFile()
    const accountList = accounts.reduce((accumulator, current) => {
      accumulator[current.accountId] = current

      return accumulator
    }, {} as AccountDataRecord)

    currentWindow.webContents.send(eventKey, {
      data: {
        currentAccount: newData,
        accounts: accountList,
      },
      accessToken: data.accessToken,
      error: null,
    })
  }

  private static async generateDeviceAuthCredencials(
    currentWindow: BrowserWindow,
    key: ElectronAPIEventKeys,
    {
      accessToken,
      accountId,
    }: {
      accessToken: string
      accountId: string
    }
  ) {
    try {
      const response = await createDeviceAuthCredentials({
        accessToken,
        accountId,
      })

      return response.data
    } catch (error) {
      Authentication.responseError({
        currentWindow,
        key,
        error,
      })
    }

    return null
  }

  private static responseError({
    currentWindow,
    error,
    key,
  }: {
    currentWindow: BrowserWindow
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
    key: ElectronAPIEventKeys
  }) {
    currentWindow.webContents.send(key, {
      accessToken: null,
      data: null,
      error: (error.response?.data as AuthorizationError).errorMessage,
    })
  }
}
