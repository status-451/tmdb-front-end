import { APP_QUERY_CLIENT } from '@/context/app/app'
import { useAuth } from '@/context/auth'
import { useReviews } from '@/hooks/use-reviews/use-reviews'
import { cn } from '@/lib/utils'
import { Review } from '@/types/supabase/reviews'
import { ComponentProps } from 'react'
import { toast } from 'sonner'

type ReviewItemActionsProps = {
  review: Review
}

type ReviewItemActionProps = {
  disabled: boolean
  active?: boolean
} & ComponentProps<'div'>

const ReviewItemAction = ({
  disabled,
  active,
  ...props
}: ReviewItemActionProps) => {
  return (
    <span
      className={cn(
        'cursor-pointer text-xs text-muted-foreground underline-offset-1 hover:underline',
        disabled && 'pointer-events-none animate-pulse opacity-50',
        active && 'font-bold text-foreground',
      )}
      {...props}
    >
      {props.children}
    </span>
  )
}

export const ReviewItemActions = ({
  review: {
    user_id: userId,
    id,
    tmdb_id: tmdbId,
    media_type: mediaType,
    review_likes: reviewLikes,
  },
}: ReviewItemActionsProps) => {
  const { user } = useAuth()
  const { handleDeleteReview, handleLikeReview, handleRemoveLike } =
    useReviews()

  const isUserOwner = user.id === userId
  const userLike = reviewLikes?.find(
    (reviewLike) => reviewLike.user_id === user.id,
  )
  const isUserLiked = Boolean(userLike)

  const invalidateQuery = () =>
    APP_QUERY_CLIENT.invalidateQueries({
      queryKey: [tmdbId, mediaType],
    })

  return (
    <div className="flex items-center space-x-2">
      <ReviewItemAction
        active={isUserLiked}
        disabled={
          isUserLiked ? handleRemoveLike.isPending : handleLikeReview.isPending
        }
        onClick={() => {
          if (isUserLiked && userLike?.id) {
            handleRemoveLike.mutateAsync(userLike.id, {
              onSuccess: () => {
                invalidateQuery()
              },
            })

            return
          }

          handleLikeReview.mutateAsync(
            {
              reviewId: id,
              userId: user.id,
            },
            {
              onSuccess: () => {
                invalidateQuery()
              },
              onError: (error) => {
                toast.error(error.message)
              },
            },
          )
        }}
      >
        Like
      </ReviewItemAction>

      <span className="h-1 w-1 rounded-full bg-muted-foreground" />

      <ReviewItemAction disabled>Reply</ReviewItemAction>

      {isUserOwner && (
        <>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />

          <ReviewItemAction
            disabled={handleDeleteReview.isPending}
            onClick={() =>
              handleDeleteReview.mutateAsync(id, {
                onSuccess: () => {
                  invalidateQuery()

                  toast.success('Review deleted successfully.')
                },
                onError: (error) => {
                  toast.error(error.message)
                },
              })
            }
          >
            Delete
          </ReviewItemAction>
        </>
      )}
    </div>
  )
}
