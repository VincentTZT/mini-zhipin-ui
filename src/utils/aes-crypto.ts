import CryptoJS from 'crypto-js'

const KEY_PREFIX = 'qP2$bG9'
const IV_SUBFIX = 'A0^uW0:'

export const AES_Encrypt = (nodeName: string, data: any): string => {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(KEY_PREFIX + nodeName), {
    iv: CryptoJS.enc.Utf8.parse(nodeName + IV_SUBFIX),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export const AES_Decrypt = (nodeName: string, encryptedStr: string): any => {
  const jsonStr = CryptoJS.AES.decrypt(encryptedStr, CryptoJS.enc.Utf8.parse(KEY_PREFIX + nodeName), {
    iv: CryptoJS.enc.Utf8.parse(nodeName + IV_SUBFIX),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8)
  return JSON.parse(jsonStr)
}
