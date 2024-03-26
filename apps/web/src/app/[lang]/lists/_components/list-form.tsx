'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Button,
} from '@plotwist/ui'

import { useLists } from '@/context/lists'
import { useAuth } from '@/context/auth'
import { useLanguage } from '@/context/language'
import { APP_QUERY_CLIENT } from '@/context/app/app'
import { listPageQueryKey } from '@/utils/list'

import { List } from '@/types/supabase/lists'

import { ListFormValues, listFormSchema } from './list-form-schema'

type ListFormProps = { trigger: JSX.Element; list?: List }

export const ListForm = ({ trigger, list }: ListFormProps) => {
  const { handleCreateNewList, handleEditList } = useLists()
  const { user } = useAuth()
  const { dictionary } = useLanguage()

  const [open, setOpen] = useState(false)

  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema(dictionary)),
    defaultValues: {
      name: list?.name ?? '',
      description: list?.description ?? '',
    },
  })

  async function onSubmit(values: ListFormValues) {
    if (!user) return

    if (list) {
      const { name, description } = values

      const variables = {
        name,
        description,
        id: list.id,
      }

      return await handleEditList.mutateAsync(variables, {
        onSuccess: () => {
          APP_QUERY_CLIENT.setQueryData(
            listPageQueryKey(variables.id),
            (query: { data: List }) => {
              const { data } = query

              return {
                ...query,
                data: {
                  ...data,
                  name: variables.name,
                  description: variables.description,
                },
              }
            },
          )

          APP_QUERY_CLIENT.setQueryData(
            ['lists', user.id],
            (query: { data: List[] }) => {
              const { data } = query

              const newData = data.map((list) => {
                if (list.id === variables.id) {
                  return {
                    ...list,
                    name: variables.name,
                    description: variables.description,
                  }
                }

                return list
              })

              return { ...query, data: newData }
            },
          )

          setOpen(false)
          toast.success(dictionary.list_form.list_edited_success)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }

    await handleCreateNewList.mutateAsync(
      { ...values, userId: user.id },
      {
        onSuccess: () => {
          APP_QUERY_CLIENT.invalidateQueries({
            queryKey: ['lists', user.id],
          })

          setOpen(false)
          form.reset({
            description: '',
            name: '',
          })

          toast.success(dictionary.list_form.list_created_success)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {list
              ? dictionary.list_form.edit_list
              : dictionary.list_form.create_new_list}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.list_form.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={dictionary.list_form.name_placeholder}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.list_form.description}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={3}
                      placeholder={dictionary.list_form.description_placeholder}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit" loading={form.formState.isSubmitting}>
                {dictionary.list_form.submit}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
