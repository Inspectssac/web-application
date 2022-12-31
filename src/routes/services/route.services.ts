import { AppServices } from '@/shared/service/app-api.service'
import { Route, RouteApiResponse, transformRouteApiToRoute } from '../models/route.model'

export default class RouteServices extends AppServices {
  constructor () {
    super({ baseUrl: 'routes', contentType: 'application/json' })
  }

  getAll = async (): Promise<Route[]> => {
    return await this.get<RouteApiResponse[]>('')
      .then(response => response.data)
      .then(transformRouteApiToRoute)
  }

  // getAll = async (): Promise<Route[]> => {
  //   return await this.fetchAll().then(transformRouteApiToRoute)
  // }
}
