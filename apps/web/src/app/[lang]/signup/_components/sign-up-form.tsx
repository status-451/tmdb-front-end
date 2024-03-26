'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Input,
} from '@plotwist/ui'

import { useAuth } from '@/context/auth'
import { Dictionary } from '@/utils/dictionaries/get-dictionaries.types'
import { SignUpFormValues, signUpFormSchema } from './sign-up-form.schema'

type SignUpFormProps = { dictionary: Dictionary }

export const SignUpForm = ({ dictionary }: SignUpFormProps) => {
  const { signUpWithCredentials } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema(dictionary)),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    await signUpWithCredentials(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.sign_up_form.username_label}</FormLabel>

              <FormControl>
                <Input placeholder="JohnDoe" autoComplete="off" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.sign_up_form.email_label}</FormLabel>

              <FormControl>
                <Input
                  placeholder="email@domain.com"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.sign_up_form.password_label}</FormLabel>

              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="*********"
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setShowPassword((prev) => !prev)}
                          type="button"
                          data-testid="toggle-password"
                        >
                          {showPassword ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>
                          {showPassword
                            ? dictionary.sign_up_form.hide_password
                            : dictionary.sign_up_form.show_password}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {dictionary.sign_up_form.submit_button}
          </Button>
        </div>
      </form>
    </Form>
  )
}
