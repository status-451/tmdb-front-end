export type List = {
  id: number
  name: string
  description: string
  created_at: string
  user_id: string
  list_items: ListItem[]
  cover_path?: string
}

export type ListItem = {
  backdrop_path: string
  created_at: string
  id: number
  list_id: number
  overview: string
  poster_path?: string
  title: string
  tmdb_id: number
  media_type: ListItemMediaType
  status: ListItemStatus
}

export type ListItemMediaType = 'TV_SHOW' | 'MOVIE'
export type ListItemStatus = 'PENDING' | 'WATCHING' | 'WATCHED'
