import { requestZhipin } from '../utils/request'

const ZHIPIN_API_URL = '/proxy/zhipin'
export default class ZhipinApi {
  static getPositionList = () => {
    return requestZhipin({
      url: ZHIPIN_API_URL,
      method: 'post',
      data: {
        method: 'GET',
        targetUrl: '/wapi/zpjob/job/recJobList'
      }
    })
  }
}
