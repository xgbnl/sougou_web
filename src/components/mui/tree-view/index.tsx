'use client'

// React Imports
import type { ReactElement, MouseEvent, ReactNode, SyntheticEvent } from 'react'
import { memo, useCallback, useMemo, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import type { Theme } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'

// Components Imports
import CustomTextField from '@/@core/components/mui/TextField'
import EmptyState from '../empty-state'

// Styled Components Imports
import TreeItemStyled from './TreeItemStyled'

// Hooks Imports
import useFieldName from './useFieldName'
import useTransform from './useTransform'

// Types Imports
import type { MuiTreeViewProps, NormalizedTreeNode, TreeOptionBase } from './types'

function selectPlaceholderLikeSx(theme: Theme) {
  return {
    color: 'currentColor',
    opacity: theme.vars ? theme.vars.opacity.inputPlaceholder : theme.palette.mode === 'light' ? 0.42 : 0.5,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter
    })
  }
}

function normalizeLeafValue(value: string | number | Array<string | number> | undefined): string[] {
  if (value === undefined || value === null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map(v => String(v))
  }

  return [String(value)]
}

function pathToNodes<T extends Record<string, unknown>>(
  leafId: string,
  byId: Map<string, NormalizedTreeNode<T>>,
  parentById: Map<string, string | undefined>
): NormalizedTreeNode<T>[] {
  const path: NormalizedTreeNode<T>[] = []
  let current: string | undefined = leafId

  while (current) {
    const node = byId.get(current)

    if (!node) {
      break
    }

    path.unshift(node)
    current = parentById.get(current)
  }

  return path
}

function pathLabelText<T extends Record<string, unknown>>(
  leafId: string,
  byId: Map<string, NormalizedTreeNode<T>>,
  parentById: Map<string, string | undefined>
): string {
  return pathToNodes(leafId, byId, parentById)
    .map(n => String(n.label ?? ''))
    .join('/')
}

function emitSelection<T extends Record<string, unknown>>(
  leafIds: string[],
  byId: Map<string, NormalizedTreeNode<T>>,
  parentById: Map<string, string | undefined>,
  multiple: boolean,
  onChange: MuiTreeViewProps<T, boolean>['onChange']
): void {
  const leaves: T[] = []

  for (const id of leafIds) {
    const node = byId.get(id)

    if (node) {
      leaves.push(node.original)
    }
  }

  const seen = new Set<string>()
  const pathNodes: T[] = []

  for (const leafId of leafIds) {
    for (const n of pathToNodes(leafId, byId, parentById)) {
      if (!seen.has(n.id)) {
        seen.add(n.id)
        pathNodes.push(n.original)
      }
    }
  }

  if (multiple) {
    ;(onChange as (selectedLeaves: T[], pathNodes: T[]) => void)(leaves, pathNodes)

    return
  }

  ;(onChange as unknown as (selectedLeaf: T | null, pathNodes: T[]) => void)(leaves[0] ?? null, pathNodes)
}

const TreeBranch = memo(function TreeBranch(props: {
  nodes: NormalizedTreeNode<Record<string, unknown>>[]
}): ReactElement {
  const { nodes } = props

  return (
    <>
      {nodes.map(node => (
        <TreeItemStyled key={node.id} itemId={node.id} label={String(node.label ?? '')}>
          {node.children && node.children.length > 0 ? (
            <TreeBranch nodes={node.children as NormalizedTreeNode<Record<string, unknown>>[]} />
          ) : null}
        </TreeItemStyled>
      ))}
    </>
  )
})

function MuiTreeView<T extends Record<string, unknown> = TreeOptionBase, M extends boolean = false>(
  props: MuiTreeViewProps<T, M>
): ReactElement {
  const { options, onChange, id, value, fieldNames, multiple = false, placeholder, ...textFieldParams } = props

  const isControlled = value !== undefined
  const [internalLeafIds, setInternalLeafIds] = useState<string[]>([])
  const [visible, setVisible] = useState<boolean>(false)

  const internalFieldNames = useFieldName(fieldNames)
  const { roots, byId, parentById } = useTransform(options, internalFieldNames)

  const selectedLeafIds = isControlled ? normalizeLeafValue(value) : internalLeafIds

  const treeBody = useMemo(
    () => (roots.length > 0 ? <TreeBranch nodes={roots as NormalizedTreeNode<Record<string, unknown>>[]} /> : null),
    [roots]
  )

  const pushSelection = useCallback(
    (nextLeafIds: string[]): void => {
      if (!isControlled) {
        setInternalLeafIds(nextLeafIds)
      }

      emitSelection(
        nextLeafIds,
        byId,
        parentById,
        multiple,
        onChange as unknown as MuiTreeViewProps<T, boolean>['onChange']
      )
    },
    [byId, isControlled, multiple, parentById, onChange]
  )

  const handleTreeItemClick = useCallback(
    (event: MouseEvent, itemId: string): void => {
      event.stopPropagation()

      const node = byId.get(itemId)

      if (!node?.isLeaf) {
        return
      }

      if (multiple) {
        const exists = selectedLeafIds.includes(itemId)
        const next = exists ? selectedLeafIds.filter(x => x !== itemId) : [...selectedLeafIds, itemId]

        pushSelection(next)
      } else {
        pushSelection([itemId])
        setVisible(false)
      }
    },
    [byId, multiple, pushSelection, selectedLeafIds]
  )

  const handleClose = (event: SyntheticEvent): void => {
    event.stopPropagation()
    setVisible(false)
  }

  const renderDisplayValue = useCallback(
    (selected: unknown): ReactNode => {
      if (multiple) {
        const ids = (selected as string[]).filter(Boolean)

        if (ids.length === 0) {
          return placeholder ? (
            <Box component='span' sx={theme => selectPlaceholderLikeSx(theme)}>
              {placeholder}
            </Box>
          ) : (
            ''
          )
        }

        const text = ids.map(leafId => pathLabelText(leafId, byId, parentById)).join(', ')

        return visible ? (
          <Box component='span' sx={theme => selectPlaceholderLikeSx(theme)}>
            {text}
          </Box>
        ) : (
          text
        )
      }

      const leafId = selected as string

      if (!leafId) {
        return placeholder ? (
          <Box component='span' sx={theme => selectPlaceholderLikeSx(theme)}>
            {placeholder}
          </Box>
        ) : (
          ''
        )
      }

      const text = pathLabelText(leafId, byId, parentById)

      return visible ? (
        <Box component='span' sx={theme => selectPlaceholderLikeSx(theme)}>
          {text}
        </Box>
      ) : (
        text
      )
    },
    [byId, multiple, parentById, placeholder, visible]
  )

  const selectValue = multiple ? selectedLeafIds : (selectedLeafIds[0] ?? '')

  const hiddenMenuSx = { display: 'none', p: 0, minHeight: 0, height: 0 } as const

  const selectAnchorMenuItems = multiple
    ? selectedLeafIds.map(id => <MenuItem key={id} value={id} tabIndex={-1} aria-hidden sx={hiddenMenuSx} />)
    : [
        <MenuItem key='__mui-tree-empty' value='' tabIndex={-1} aria-hidden sx={hiddenMenuSx} />,
        ...(selectValue !== ''
          ? [
              <MenuItem
                key={String(selectValue)}
                value={String(selectValue)}
                tabIndex={-1}
                aria-hidden
                sx={hiddenMenuSx}
              />
            ]
          : [])
      ]

  return (
    <>
      <CustomTextField
        onClick={(): void => setVisible(true)}
        select
        value={selectValue}
        placeholder={placeholder}
        {...textFieldParams}
        slotProps={{
          select: {
            multiple,
            displayEmpty: true,
            MenuProps: {
              PaperProps: {
                style: {
                  top: '150px',
                  maxHeight: 'calc(50% - 96px)'
                }
              }
            },
            open: visible,
            onClose: handleClose,
            renderValue: renderDisplayValue
          }
        }}
      >
        {selectAnchorMenuItems}
        {roots.length > 0 ? (
          <SimpleTreeView
            multiSelect={multiple}
            selectedItems={(multiple ? selectedLeafIds : (selectedLeafIds[0] ?? null)) as never}
            id={id}
            onItemClick={handleTreeItemClick}
          >
            {treeBody}
          </SimpleTreeView>
        ) : (
          <EmptyState />
        )}
      </CustomTextField>
    </>
  )
}

export default MuiTreeView
