
import axios from 'axios'
// import qs from 'qs'
const Req = {
  request(type, api, params, paramsType = 'form') {
    let config = {}
    if (type === 'get') {
      config = {
        method: type,
        url: api,
        params: params
      }
    } else {
      config = {
        method: type,
        url: api,
        data: params
      }
    }
    config.timeout = 10000
    if(paramsType === 'text') {
      axios.defaults.headers['Content-Type'] = 'text/plain'
    }
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return axios(config).then(response => {
      const res = response.data
      if (res.code !== 0) {
        return this.error(res.msg)
      } else {
        return res
      }
    })
  },
  error(err) {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  },
}

export default Req
