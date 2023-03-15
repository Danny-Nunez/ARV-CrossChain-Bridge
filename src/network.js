
import { setup } from 'axios-cache-adapter'
import { BACKEND_URL } from "./store/config";
import * as ax from "axios";


export const axios =
  ax.create({
    baseURL: BACKEND_URL
  })



// setup({
//   baseURL: BACKEND_URL,
//   cache: {
//     exclude: {
//       // Only exclude PUT, PATCH and DELETE methods from cache
//       methods: ['put', 'patch', 'delete', 'post', 'get']
//     }
//   }
// })

export const axiosWithCache = setup({
  baseURL: BACKEND_URL,
  cache: {
    maxAge: 20 * 60 * 1000, // 15 minute
    exclude: { query: false }
  },

})


export function setAxiosHeaders(headers) {
  ax.defaults.headers = headers
  axios.defaults.headers['common'] = headers
  axiosWithCache.defaults.headers['common'] = headers

}

export async function sendCachedRequest(url, callback, method = 'get', data = null, reload = true) {
  await axiosWithCache(
    {
      method: method,
      url: url,
      data: data,
    }
  )
    .then((res) => {
      // if (res.fromCache && reload)
      console.log(reload)
      callback(res);
    })

  if (reload)
    await axios(
      {
        method: method,
        url: url,
        data: data,
      }
    )
      .then((res) => {
        callback(res)
      })
}

// // Use global instance config
// api.get('/get').then((response) => {
//   // Do something awesome with response
// })

// // Override `maxAge` and cache URLs with query parameters
// api.get('/get?with=query', {
//   cache: {
//     maxAge: 2 * 60 * 1000, // 2 min instead of 15 min
//     exclude: { query: false }
//   }
// })
//   .then((response) => {
//     // Do something beautiful ;)
//   })