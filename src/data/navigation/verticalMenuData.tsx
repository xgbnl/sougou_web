// NextAuth Imports
import type { User } from 'next-auth'

// Util Imports
import type { getDictionary } from '@/utils/getDictionary'

// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

type Role = User['role']

type AuthorizedVerticalMenuDataType = VerticalMenuDataType & {
  permissions?: Role[]
  children?: AuthorizedVerticalMenuDataType[]
}

const isSection = (item: AuthorizedVerticalMenuDataType): boolean => {
  return 'isSection' in item && item.isSection === true
}

const filterByPermission = (menuData: AuthorizedVerticalMenuDataType[], role: Role): VerticalMenuDataType[] => {
  return menuData.reduce<VerticalMenuDataType[]>((items, item) => {
    const { permissions, children, ...rest } = item

    if (permissions && !permissions.includes(role)) {
      return items
    }

    if (Array.isArray(children)) {
      const filteredChildren = filterByPermission(children, role)

      if (filteredChildren.length === 0) {
        return items
      }

      items.push({
        ...rest,
        children: filteredChildren
      } as VerticalMenuDataType)

      return items
    }

    if (isSection(item)) {
      return items
    }

    items.push(rest as VerticalMenuDataType)

    return items
  }, [])
}

const verticalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  role: User['role'] = 'viewer'
): VerticalMenuDataType[] => {
  const menuData: AuthorizedVerticalMenuDataType[] = [
    {
      label: dictionary['navigation'].dashboard,
      href: `/${dictionary['locale']}/dashboard`,
      icon: 'tabler-dashboard',
      permissions: ['admin', 'viewer']
    },
    {
      isSection: true,
      label: dictionary['navigation'].operations,
      permissions: ['admin'],
      children: [
        {
          label: dictionary['navigation'].userManagement,
          href: `/${dictionary['locale']}/users`,
          icon: 'tabler-users',
          permissions: ['admin']
        },
        {
          label: dictionary['navigation'].accountManagement,
          href: `/${dictionary['locale']}/accounts`,
          icon: 'tabler-id',
          permissions: ['admin']
        }
      ]
    },
    {
      isSection: true,
      label: dictionary['navigation'].data,
      permissions: ['admin', 'viewer'],
      children: [
        {
          label: dictionary['navigation'].leadCenter,
          href: `/${dictionary['locale']}/marketing-leads`,
          icon: 'tabler-address-book',
          permissions: ['admin', 'viewer']
        }
      ]
    },
    {
      isSection: true,
      label: dictionary['navigation'].systemSettings,
      permissions: ['admin'],
      children: [
        {
          label: dictionary['navigation'].formFilter,
          href: `/${dictionary['locale']}/system-settings/form-filters`,
          icon: 'tabler-filter',
          permissions: ['admin']
        }
      ]
    }
  ]

  return filterByPermission(menuData, role)
}

export default verticalMenuData
