import { AppServices } from '@/shared/service/app.service'
import { Route, RouteApiResponse, transformRouteApiToRoute } from '../models/route.model'

export default class RouteServices extends AppServices {
  constructor () {
    super({ baseUrl: 'routes', contentType: 'application/json' })
  }

  getAll = async (): Promise<Route[]> => {
    console.log(this._fullBaseApiURL)
    return this.get<RouteApiResponse[]>('')
      .then(response => response.data)
      .then(transformRouteApiToRoute)
  }

  // getAll = async (): Promise<Route[]> => {
  //   return await this.fetchAll().then(transformRouteApiToRoute)
  // }
}
