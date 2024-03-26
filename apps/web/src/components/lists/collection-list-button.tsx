'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

import { Movie } from '@plotwist/tmdb'

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@plotwist/ui'

import { useLists } from '@/context/lists'
import { APP_QUERY_CLIENT } from '@/context/app/app'

import { sanitizeListItem } from '@/utils/tmdb/list/list_item'

import { List } from '@/types/supabase/lists'
import { useLanguage } from '@/context/language'
import { useAuth } from '@/context/auth'

const areAllItemsIncluded = (list: List, items: Movie[]) => {
  const included = items.every((item) =>
    list.list_items.some((listItem) => listItem.tmdb_id === item.id),
  )

  return included
}

const getIncludedItemIds = (list: List, items: Movie[]) => {
  return list.list_items
    .filter((listItem) => items.some((item) => item.id === listItem.tmdb_id))
    .map((listItem) => listItem.id)
}

type CollectionListDropdownProps = {
  items: Movie[]
}

export const CollectionListDropdown = ({
  items,
}: CollectionListDropdownProps) => {
  const { lists, handleAddCollectionToList, handleRemoveCollectionFromList } =
    useLists()
  const { push } = useRouter()
  const { dictionary, language } = useLanguage()
  const { user } = useAuth()

  const handleRemove = useCallback(
    async (ids: string[]) => {
      if (!user) return

      await handleRemoveCollectionFromList.mutateAsync(
        {
          ids,
        },
        {
          onSuccess: () => {
            APP_QUERY_CLIENT.invalidateQueries({
              queryKey: ['lists', user.id],
            })

            toast.success(
              dictionary.collection_list_dropdown
                .collection_removed_successfully,
            )
          },
        },
      )
    },
    [dictionary, handleRemoveCollectionFromList, user],
  )

  const handleAdd = useCallback(
    async (list: List) => {
      if (!user) return

      const sanitizedItems = items.map((item) =>
        sanitizeListItem(list.id, item),
      )

      await handleAddCollectionToList.mutateAsync(
        { items: sanitizedItems },
        {
          onSuccess: () => {
            APP_QUERY_CLIENT.invalidateQueries({
              queryKey: ['lists', user.id],
            })

            toast.success(
              dictionary.collection_list_dropdown.collection_added_successfully,
              {
                action: {
                  label: dictionary.collection_list_dropdown.view_list,
                  onClick: () => push(`/${language}/lists/${list.id}`),
                },
              },
            )
          },
        },
      )
    },
    [handleAddCollectionToList, items, push, dictionary, language, user],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-6 px-2.5 py-0.5 text-xs">
          <Plus className="mr-2" size={12} />

          {dictionary.collection_list_dropdown.add_collection_to_list}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {dictionary.collection_list_dropdown.my_lists}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {lists.map((list) => {
          const itemsIncluded = areAllItemsIncluded(list, items)

          return (
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              key={list.id}
              checked={itemsIncluded}
              onClick={() =>
                itemsIncluded
                  ? handleRemove(getIncludedItemIds(list, items))
                  : handleAdd(list)
              }
            >
              {list.name}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
