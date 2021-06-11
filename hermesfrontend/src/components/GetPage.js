import React from 'react'
import { useSelector } from 'react-redux'

export const SinglePostPage = ({ match }) => {
  const { godID } = match.params

  const god = useSelector(state =>
    state.posts.find(god => god.id === godID)
  )

  if (!god) {
    return (
      <section>
        <h2>god not found!</h2>
      </section>
    )
  }

  return (
      <>
      fucking
      god
      </>
  )
}
