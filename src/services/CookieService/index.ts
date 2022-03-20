export const setCookie = (name, value, expirationDateUTC) => {
  // Good explanations of cookie attributes: https://blog.logrocket.com/javascript-developer-guide-browser-cookies/
  const cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expirationDateUTC}; secure; SameSite=Strict`
  document.cookie = cookie
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=; max-age=0`
}

export const getCookie = (name) => {
  const cookieArr = document.cookie.split(';')
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=')
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1])
    }
  }
  return null
}
