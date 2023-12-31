import { MovieList } from '../../components/movie-list'

const UpcomingMoviesPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">Upcoming</h1>
        <p className="text-muted-foreground">
          Movies that are being released soon.
        </p>
      </div>

      <MovieList variant="upcoming" />
    </div>
  )
}

export default UpcomingMoviesPage
