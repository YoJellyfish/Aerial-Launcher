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
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '../../../components/ui/card'

import { useGetSelectedAccount } from '../../../hooks/accounts'
import { useHandlers } from './-actions'

import { parseCustomDisplayName } from '../../../lib/utils'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/stw-operations/save-quests',
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
              <BreadcrumbPage>Save Quests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Content />
      </>
    )
  },
})

function Content() {
  const { selected } = useGetSelectedAccount()
  const { handleSave } = useHandlers()

  return (
    <div className="flex flex-grow">
      <div className="flex items-center justify-center w-full">
        <Card className="max-w-sm w-full">
          <CardContent className="grid gap-4 pt-6">
            <CardDescription>
              Account selected:{' '}
              <span className="font-bold">
                {selected?.displayName}
                {parseCustomDisplayName(selected)}
              </span>
            </CardDescription>
          </CardContent>
          <CardFooter className="space-x-6">
            <Button
              className="w-full"
              onClick={handleSave}
            >
              Save Quests
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}