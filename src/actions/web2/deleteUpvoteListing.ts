import client from 'lib/axios'

/**
 * Get rid of upvote on a listing.
 * @param listingId -- listingId of token to be upvoted
 * @param jwt -- auth token for user
 */
export const deleteUpvoteListing = async (listingId: string, jwt: string) => {
  const headers = {
    Authorization: jwt ? `Bearer ${jwt}` : null,
  }
  const data = {
    listingId,
  }

  try {
    const response = await client.delete(`/votes/up`, { headers, data })
    return response?.data?.data
  } catch (error) {
    console.error(
      `Could not delete the upvote for listing with listingID of ${listingId}`,
      error
    )
    return null
  }
}
