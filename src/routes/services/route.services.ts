import { Report } from '@/reports/models/report.interface'
import { DateRange } from '@/shared/models/date-range'
import { AppServices } from '@/shared/service/app-api.service'
import { Route } from '../models/route.interface'

export interface FindAllOptions {
  dateRange: DateRange
  profileId: number
}

export default class RoutesServices extends AppServices {
  constructor () {
    super({ baseUrl: 'routes', contentType: 'application/json' })
  }

  findAll = async ({ dateRange, profileId }: FindAllOptions): Promise<Route[]> => {
    const dateStart = dateRange.formattedDateStart()
    const dateEnd = dateRange.formattedDateEnd()

    return await this.get<Route[]>(`?date-start=${dateStart}&date-end=${dateEnd}&profile-id=${profileId}`)
      .then(response => {
        const routes = response.data
        createRouteStorage(routes, dateRange)
        return routes
      })
  }

  findById = async (id: string): Promise<Route> => {
    return await this.get<Route>(`/${id}`)
      .then(response => response.data)
  }
}

const createRouteStorage = (routes: Route[], dateRange: DateRange): void => {
  const aux: Report[] = []
  const reports = routes.reduce((previosValue, currentValue) => previosValue.concat(currentValue.reports), aux)

  localStorage.setItem('routes-request', JSON.stringify({
    routes,
    reports,
    dateRange: dateRange.toObject(),
    lastRequest: new Date()
  }))
}
