export const localSave = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const localRead = (key: string) => {
  return localStorage.getItem(key) || ''
}

export const localClear = () => {
  localStorage.clear()
}
