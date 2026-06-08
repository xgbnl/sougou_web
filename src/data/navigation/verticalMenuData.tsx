// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  {
    label: dictionary['navigation'].dashboard,
    href: `/${dictionary['locale']}/dashboard`,
    icon: 'tabler-dashboard'
  },
  {
    label: dictionary['navigation'].userManagement,
    href: `/${dictionary['locale']}/users`,
    icon: 'tabler-users'
  },
  {
    label: dictionary['navigation'].leadCenter,
    href: `/${dictionary['locale']}/marketing-leads`,
    icon: 'tabler-address-book'
  }
]

export default verticalMenuData
