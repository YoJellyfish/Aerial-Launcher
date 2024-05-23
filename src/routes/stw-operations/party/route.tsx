import { Link, createRoute } from '@tanstack/react-router'

import { Route as RootRoute } from '../../__root'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb'
import { KickAllPartyCard } from './-kick-all-party'

import { ClaimRewardsCard } from './-claim-rewards'
import { InviteCard } from './-invite'
import { LeavePartyCard } from './-leave-party'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/stw-operations/party',
  component: () => {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>STW Operations</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Party</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Content />
      </>
    )
  },
})

function Content() {
  return (
    <div className="flex flex-grow">
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center space-y-5 w-full">
          <KickAllPartyCard />
          <div className="flex gap-5 items-center justify-center">
            <ClaimRewardsCard />
            <LeavePartyCard />
          </div>
          <InviteCard />
        </div>
      </div>
    </div>
  )
}