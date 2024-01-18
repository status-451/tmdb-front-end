import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TMDB } from '@/services/TMDB'
import { tmdbImage } from '@/utils/tmdb/image'

import { TvShowSeasons } from './tv-show-seasons'
import { TvShowCredits } from './tv-show-credits'
import { TvShowRelated } from './tv-show-related'
import { TvShowDetailsInfo } from './tv-show-details-info'

import { Banner } from '@/components/banner'
import { Poster } from '@/components/poster'
import { Reviews } from '@/components/reviews'
import { Images } from '@/components/images'
import { Videos } from '@/components/videos'

type TvShowsDetailsProps = {
  id: number
}

export const TvShowsDetails = async ({ id }: TvShowsDetailsProps) => {
  const tvShow = await TMDB.tvShows.details(id)

  return (
    <div>
      <Banner url={tmdbImage(tvShow.backdrop_path)} />

      <div className="mx-auto my-8 max-w-4xl space-y-12 p-4">
        <main className="flex gap-4">
          <aside className="-mt-32 w-1/3 space-y-2">
            <Poster url={tmdbImage(tvShow.poster_path)} alt={tvShow.name} />
          </aside>

          <TvShowDetailsInfo tvShow={tvShow} />
        </main>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-4">
            <Reviews tmdbItem={tvShow} mediaType="TV_SHOW" />
          </TabsContent>

          <TabsContent value="seasons" className="mt-4">
            <TvShowSeasons seasons={tvShow.seasons} tvShowID={id} />
          </TabsContent>

          <TabsContent value="credits" className="mt-4">
            <TvShowCredits tvShowID={id} />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4">
            <TvShowRelated tvShowID={id} variant="recommendations" />
          </TabsContent>

          <TabsContent value="similar" className="mt-4">
            <TvShowRelated tvShowID={id} variant="similar" />
          </TabsContent>

          <TabsContent value="images" className="mt-4">
            <Images tmdbId={id} variant="tvShows" />
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <Videos tmdbId={id} variant="tvShows" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}