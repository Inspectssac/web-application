import React, { useState, useEffect, ReactElement } from 'react'

import RouteServices from '@/routes/services/route.services'
import { Route } from '../models/route.model'
import { useDispatch } from 'react-redux'
import { logout } from '@/shared/store/features/auth-slice'

const RoutesView = (): ReactElement => {
  const dispatch = useDispatch()
  const routeServices = new RouteServices()
  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    void routeServices.getAll()
      .then(setRoutes)
  }, [])

  const handleLogout = (): void => {
    dispatch(logout({}))
    location.reload()
  }

  return (
    <div>
      <h2 className="font-bold text-3x text-left mt-4 mb-10">Routes</h2>

      {
        routes.map(route => {
          return (
            <div key={route.id}>
              <h3>{ route.startLocation }</h3>
              <p>{ route.createdAt }</p>
              <p>{ route.updatedAt }</p>
              <p>{ route.validated }</p>
            </div>
          )
        })
      }

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default RoutesView
