import axios from 'axios'

export default async function submitVerificationFeeHash(
  uuid: string,
  tx: string
): Promise<string> {
  const payload = {
    uuid: uuid,
    tx: tx,
  }

  try {
    const response = await axios.post(
      'https://verification.backend.ideamarket.io/feeTxConfirmed',
      payload
    )

    return response.data.data.tx
  } catch (ex) {
    if (ex.response?.data?.message) {
      throw ex.response.data.message
    } else {
      throw Error('Error while contacting verification service.')
    }
  }
}
