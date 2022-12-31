import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export abstract class AppServices {
  _baseUrl: string
  _fullBaseApiURL: string
  _contentType: string

  constructor (config: { baseUrl: string, contentType: string }) {
    this._baseUrl = config.baseUrl
    this._contentType = config.contentType

    this._fullBaseApiURL = `${API_BASE_URL}/${this._baseUrl}`
    this.setHeader()
  }

  setHeader (): void {
    // TODO: when working with auth
    // axios.defaults.headers.common.Authorization = `Bearer ${tokenService.getToken()}`
    // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
    axios.defaults.headers.common['Content-Type'] = this._contentType
  }

  removeHeader (): void {
    axios.defaults.headers.common = {}
  }

  async get <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.get(this._fullBaseApiURL + url, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }

  async post <T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.post(this._fullBaseApiURL + url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }

  async patch <T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.patch(this._fullBaseApiURL + url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }

  async delete <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.delete(this._fullBaseApiURL + url, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }
}
