import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import RoutesView from '@/routes/pages/RoutesView'

function App (): ReactElement {
  return (
    <div>
      <Routes>
        <Route path="/routes" element={<RoutesView />} />
      </Routes>
    </div>
  )
}

export default App
