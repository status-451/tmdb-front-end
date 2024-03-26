import Image from 'next/image'
import Link from 'next/link'

import {
  MovieWithMediaType,
  PersonWithMediaType,
  TvSerieWithMediaType,
} from '@plotwist/tmdb'
import { Skeleton } from '@plotwist/ui'

import { Language } from '@/types/languages'
import { tmdbImage } from '@/utils/tmdb/image'

type CommandSearchItemProps<T> = { language: Language; item: T }

export const CommandSearchMovie = ({
  item,
  language,
}: CommandSearchItemProps<MovieWithMediaType>) => {
  return (
    <Link
      href={`/${language}/movies/${item.id}`}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-sm px-2 py-1 hover:bg-muted"
    >
      <span className="text-md truncate whitespace-nowrap">{item.title}</span>

      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {item.release_date !== '' && new Date(item.release_date).getFullYear()}
      </span>
    </Link>
  )
}

export const CommandSearchTvSerie = ({
  item,
  language,
}: CommandSearchItemProps<TvSerieWithMediaType>) => {
  return (
    <Link
      className="flex cursor-pointer items-center justify-between gap-4 rounded-sm px-2 py-1 hover:bg-muted"
      href={`/${language}/tv-series/${item.id}`}
    >
      <span className="text-md truncate whitespace-nowrap">{item.name}</span>

      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {item.first_air_date && new Date(item.first_air_date).getFullYear()}
      </span>
    </Link>
  )
}

export const CommandSearchPerson = ({
  item,
  language,
}: CommandSearchItemProps<PersonWithMediaType>) => {
  return (
    <Link
      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted"
      href={`/${language}/people/${item.id}`}
    >
      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-muted-foreground">
        {item.profile_path ? (
          <Image
            fill
            className="object-cover"
            src={tmdbImage(item.profile_path)}
            alt={item.name}
            loading="lazy"
            sizes="100%"
          />
        ) : (
          item.name[0]
        )}
      </div>

      <span className="text-sm">{item.name}</span>
    </Link>
  )
}

export const CommandSearchSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-sm px-2 py-1">
    <Skeleton className="h-[2ex] w-[20ch]" />
    <Skeleton className="h-[2ex] w-[4ch]" />
  </div>
)
