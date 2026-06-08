'use client'

// React Imports
import { useDeferredValue, useMemo } from 'react'

// Types Imports
import type { InternalFieldNames, NormalizedTreeNode, TreeBuildResult, TreeOptionBase } from './types'

function transform<T extends Record<string, unknown>>(
  opts: T[],
  fieldNames: InternalFieldNames,
  byId: Map<string, NormalizedTreeNode<T>>,
  parentById: Map<string, string | undefined>,
  parentId?: string
): NormalizedTreeNode<T>[] {
  const { label, value, children } = fieldNames

  return opts.map(option => {
    const childrenList = option[children as keyof T] as T[] | undefined
    const isNotEmpty = Array.isArray(childrenList) && childrenList.length > 0
    const id = String(option[value as keyof T] ?? '')

    const node: NormalizedTreeNode<T> = {
      id,
      label: option[label as keyof T],
      isLeaf: typeof option.isLeaf === 'boolean' ? option.isLeaf : !isNotEmpty,
      original: option
    }

    byId.set(id, node)
    parentById.set(id, parentId)

    if (isNotEmpty) {
      node.children = transform(childrenList, fieldNames, byId, parentById, id)
    }

    return node
  })
}

function buildTree<T extends Record<string, unknown>>(
  options: T[],
  fieldNames: InternalFieldNames
): TreeBuildResult<T> {
  const byId = new Map<string, NormalizedTreeNode<T>>()
  const parentById = new Map<string, string | undefined>()
  const roots = transform(options, fieldNames, byId, parentById, undefined)

  return { roots, byId, parentById }
}

const useTransform = <T extends Record<string, unknown> = TreeOptionBase>(
  options: T[],
  fieldNames: InternalFieldNames
): TreeBuildResult<T> => {
  const deferredOptions = useDeferredValue(options)

  return useMemo(() => buildTree(deferredOptions, fieldNames), [deferredOptions, fieldNames])
}

export default useTransform
