export const walletVerificationRequest = async () => {
  const response = await fetch('/api/walletVerificationRequest', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data?.message)
  }
  return await response.json()
}
