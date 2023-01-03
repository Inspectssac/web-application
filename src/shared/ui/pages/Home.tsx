import RouteServices from '@/routes/services/route.services'
import useMediaQuery from '@/shared/hooks/userMediaQuery'
import React, { ReactElement, useEffect, useState } from 'react'

const Home = (): ReactElement => {
  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')
  const [routesCount, setRoutesCount] = useState(0)

  useEffect(() => {
    const routeServices = new RouteServices()
    void routeServices.getAll()
      .then(response => {
        setRoutesCount(response.length)
      })
  }, [])

  return (
    <div className='container'>
      <main className={`${isAboveSmallScreens ? 'grid grid-cols-4 gap-2' : ''}`}>
        <div className='shadow-lg rounded-md border border-gray-400 border-opacity-10 bg-gray-100 py-2 px-4 text-center'>
          <h1 className='text-xl font-bold uppercase'>Active routes</h1>
          <p className='text-lg font-bold text-red'>{routesCount}</p>
        </div>
      </main>
    </div>
  )
}

export default Home
