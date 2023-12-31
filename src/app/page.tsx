import { Header } from '@/components/header'
import { MoviesList } from '@/components/movies-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-article p-4">
      <Header />

      <section className="flex h-[75vh] items-center md:h-[50vh]">
        <div className="flex flex-col md:w-1/2">
          <div className="mb-4 h-4 w-1/4 rounded-sm bg-muted" />

          <h1 className="text-3xl font-bold">
            Explore movies, TV shows e people!
          </h1>

          <p className="text-muted-foreground">
            TMDB is for cinema fans who like to explore millions of movies and
            series, with information such as synopsis, cast, budget and much
            more.{' '}
          </p>

          <div className="mt-2 flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Start now</Link>
            </Button>

            <Button>Read more</Button>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        <MoviesList variant="topRated" />
      </div>
    </main>
  )
}
