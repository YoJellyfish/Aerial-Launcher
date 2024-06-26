import type { AxiosRequestConfig } from 'axios'
import type {
  AuthorizationCodeResponse,
  CreateExchangeCodeResponse,
  DeviceAuthResponse,
  ExchangeCodeResponse,
} from '../../types/services/authorizations'

import { oauthService } from '../config/oauth'
import { publicAccountService } from '../config/public-account'

export function getAccessTokenUsingAuthorizationCode(code: string) {
  return oauthService.post<AuthorizationCodeResponse>('/token', {
    grant_type: 'authorization_code',
    code,
  })
}

export function getAccessTokenUsingExchangeCode(
  exchange_code: string,
  config?: AxiosRequestConfig
) {
  return oauthService.post<ExchangeCodeResponse>(
    '/token',
    {
      grant_type: 'exchange_code',
      exchange_code,
    },
    config
  )
}

export function getAccessTokenUsingDeviceAuth(
  {
    accountId,
    deviceId,
    secret,
  }: {
    accountId: string
    deviceId: string
    secret: string
  },
  config?: AxiosRequestConfig
) {
  return oauthService.post<AuthorizationCodeResponse>(
    '/token',
    {
      secret,
      grant_type: 'device_auth',
      account_id: accountId,
      device_id: deviceId,
    },
    config
  )
}

export function getExchangeCodeUsingAccessToken(accessToken: string) {
  return oauthService.get<CreateExchangeCodeResponse>('/exchange', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export function createDeviceAuthCredentials({
  accessToken,
  accountId,
}: {
  accessToken: string
  accountId: string
}) {
  return publicAccountService.post<DeviceAuthResponse>(
    `/${accountId}/deviceAuth`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export function oauthVerify(
  accessToken: string,
  config?: AxiosRequestConfig
) {
  return oauthService.get<
    Omit<AuthorizationCodeResponse, 'access_token'> & {
      token: string
    }
  >('/verify', {
    ...(config ?? {}),
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
