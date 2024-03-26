import Image from 'next/image'
import Link from 'next/link'
import { forwardRef } from 'react'

import { Skeleton } from '@plotwist/ui'
import {
  MovieWithMediaType,
  Person,
  TvSerieWithMediaType,
} from '@plotwist/tmdb'

import { Language } from '@/types/languages'
import { tmdbImage } from '@/utils/tmdb/image'

type PersonCardProps = { person: Person; language: Language }

export const PersonCard = ({ person, language }: PersonCardProps) => {
  const { id, profile_path: profilePath, name, known_for: knownFor } = person

  const credits = knownFor
    .map((item) => {
      return (
        (item as MovieWithMediaType).title ??
        (item as TvSerieWithMediaType).name
      )
    })
    .join(', ')

  return (
    <Link
      href={`/${language}/people/${id}`}
      className="w-full cursor-pointer space-y-2"
      data-testid="movie-card"
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-background/50 shadow">
        {profilePath ? (
          <Image
            fill
            className="object-cover"
            src={tmdbImage(profilePath, 'w500')}
            alt={name}
            sizes="100%"
          />
        ) : (
          name[0]
        )}
      </div>

      <div className="space-y-1.5">
        <h5 className="text-sm leading-4">{name}</h5>
        <p className="line-clamp-3 text-[10px] text-muted-foreground">
          {credits}
        </p>
      </div>
    </Link>
  )
}

export const PersonCardSkeleton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="w-full cursor-pointer space-y-2" ref={ref}>
      <Skeleton className="aspect-square w-full rounded-md shadow" />

      <div className="space-y-2">
        <Skeleton className="h-[2ex] w-[10ch]" />

        <div className="space-y-1">
          <Skeleton className="h-[1.2ex] w-full" />
          <Skeleton className="h-[1.2ex] w-full" />
          <Skeleton className="h-[1.2ex] w-full" />
        </div>
      </div>
    </div>
  )
})
PersonCardSkeleton.displayName = 'PersonCardSkeleton'
