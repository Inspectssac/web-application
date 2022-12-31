export interface Route {
  id: string
  createdAt: string
  updatedAt: string
  startLocation: string
  endLocation: string
  validated: boolean
}

export interface RouteApiResponse {
  id: string
  createdAt: string
  updatedAt: string
  startLocation: string
  endLocation: string
  validated: boolean
  vehicles: []
  reports: []
}

export const transformRouteApiToRoute = (routesApi: RouteApiResponse[]): Route[] => {
  return routesApi.map(routeApi => {
    const {
      id,
      createdAt,
      updatedAt,
      startLocation,
      endLocation,
      validated
    } = routeApi

    return {
      id,
      createdAt,
      updatedAt,
      startLocation,
      endLocation,
      validated
    }
  })
}
