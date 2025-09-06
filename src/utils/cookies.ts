import Cookies from 'js-cookie'
import _ from 'lodash'

const Cookie = Cookies.withConverter({
  write: (value, name) => value
})

export function setZhiPinToken(cookieString: string) {
  cookieString.split(';').forEach((item: string) => {
    if (_.trim(item)) {
      const [key, value] = item.split('=')
      if (_.trim(key) && _.trim(value)) {
        Cookie.set(key.trim(), value.trim())
      }
    }
  })
}

export function removeAllCookies() {
  document.cookie.split(/; ?/).forEach(function (cookie) {
    Cookies.remove(cookie.split('=')[0])
  })
  localStorage.clear()
}

export default Cookie
