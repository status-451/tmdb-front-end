import { TMDB } from '@/services/TMDB'
import { MovieCollectionDialog } from './movie-collection-dialog'
import { tmdbImage } from '@/utils/tmdb/image'

type MovieCollectionProps = {
  collectionId: number
}

export const MovieCollection = async ({
  collectionId,
}: MovieCollectionProps) => {
  const collection = await TMDB.collections.details(collectionId)
  const backdropURL = tmdbImage(collection.backdrop_path)

  return (
    <div className="relative h-[40vh] overflow-hidden rounded-md border p-8">
      <div
        style={{
          backgroundImage: `url('${backdropURL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="absolute left-0 top-0 -z-10 h-full w-full brightness-[25%]"
      />

      <div className="flex h-full flex-col justify-end">
        <span className="text-sm text-white">Part of</span>
        <span className="text-3xl font-bold text-white">{collection.name}</span>

        <div className="mt-2">
          <MovieCollectionDialog collection={collection} />
        </div>
      </div>
    </div>
  )
}
