import { fetchWrapper } from './fetch-wrapper'
import { BASE_API } from './constants'

const parseData = async (response) => {
  return response instanceof Promise ? (await response)?.data : response.data
}

export const getPayments = async (page, perPage, state) => {
  return parseData(
    fetchWrapper.get(`${BASE_API}api/transactions?page=${page}&per_page=${perPage}&state=${state}`)
  )
}

export const makePayments = async (payload) => {
  return parseData(fetchWrapper.post(`${BASE_API}api/pay-dues`, payload))
}
