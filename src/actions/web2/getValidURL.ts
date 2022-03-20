import client from 'lib/axios'

/**
 * Webscrapes the URL passed in. If URL is valid, it returns the canonical URL. If not, return null
 */
export const getValidURL = async (url: string) => {
  const decodedValue = decodeURIComponent(url) // Decode so that special characters look normal
  try {
    const response = await client.get(`/general/valid-url`, {
      params: {
        url: decodedValue,
      },
    })

    return response?.data?.data?.validUrl
  } catch (error) {
    console.error(`Could not get canonical from ${url}`, error)
    return null
  }
}
