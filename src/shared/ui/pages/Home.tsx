import React, { ReactElement, useEffect, useState } from 'react'
import RouteServices from '@/routes/services/route.services'
import useMediaQuery from '@/shared/hooks/userMediaQuery'

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
        <div className='shadow-md hover:shadow-xl bg-white rounded-md py-2 px-4 text-center'>
          <h1 className='text-xl uppercase'>Active routes</h1>
          <p className='text-lg font-bold'>{routesCount}</p>
        </div>
      </main>
    </div>
  )
}

export default Home
