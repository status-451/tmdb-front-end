'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button, Skeleton } from '@plotwist/ui'

import { Banner } from '@/components/banner'

import { ListItems } from './_components/list-items'
import { DataTableSkeleton } from './_components/data-table'
import { ListForm } from '../_components/list-form'

import { tmdbImage } from '@/utils/tmdb/image'
import { listPageQueryKey } from '@/utils/list'

import { useAuth } from '@/context/auth'
import { useLanguage } from '@/context/language'
import { supabase } from '@/services/supabase'
import { List } from '@/types/supabase/lists'
import { ListModeContextProvider } from '@/context/list-mode'
import { UserResume } from './_components/user-resume'

type ListPageProps = {
  params: { id: string }
}

const ListPage = ({ params: { id } }: ListPageProps) => {
  const { user } = useAuth()
  const { dictionary } = useLanguage()

  const { data: response, isLoading } = useQuery({
    queryKey: listPageQueryKey(id),
    queryFn: async () => {
      const response = await supabase
        .from('lists')
        .select('*, list_items(*, id)')
        .eq('id', id)
        .order('created_at', { referencedTable: 'list_items' })
        .single<List>()

      return response
    },
  })

  const mode = useMemo(() => {
    if (!user || !response?.data) return 'SHOW'

    const isOwner = user.id === response.data.user_id
    if (isOwner) return 'EDIT'

    return 'SHOW'
  }, [response, user])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-4 lg:px-0">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>

        <div>
          <div className="flex items-start gap-2">
            <Skeleton className="mb-2 h-8 w-[20ch]" />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              by
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-[2ex] w-[11ch]" />
            </div>
          </div>

          <Skeleton className="h-[1.5ex] w-[30ch]" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>

        <DataTableSkeleton />
      </div>
    )
  }

  if (!response?.data) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {dictionary.list_page.list_not_found}
            </h1>

            <p className="text-muted-foreground">
              {dictionary.list_page.see_your_lists_or_create_new}{' '}
              <Link href="/lists" className="underline">
                {dictionary.list_page.here}
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const list = response.data

  return (
    <>
      <head>
        <title>{list.name}</title>
        <meta name="description" content={list.description} />
      </head>

      <ListModeContextProvider mode={mode}>
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-4 lg:px-0">
          <Banner url={tmdbImage(list.cover_path ?? '')} />

          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{list.name}</h1>
                {mode === 'SHOW' && <UserResume userId={list.user_id} />}

                {mode === 'EDIT' && (
                  <ListForm
                    trigger={
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    }
                    list={list}
                  />
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {list.description}
              </p>
            </div>
          </div>

          <ListItems listItems={list.list_items} />
        </div>
      </ListModeContextProvider>
    </>
  )
}

export default ListPage
