import { MovieList } from '../../components/movie-list'

const PopularMoviesPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">Popular</h1>
        <p className="text-muted-foreground">Movies ordered by popularity.</p>
      </div>

      <MovieList variant="popular" />
    </div>
  )
}

export default PopularMoviesPage
