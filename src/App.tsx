import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginView from './iam/pages/LoginView'
import RoutesView from './routes/pages/RoutesView'
import Layout from './shared/components/Layout'
import RequireAuth from './shared/components/RequiredAuth'

function App (): ReactElement {
  return (
    <Routes>
      <Route index path='login' element={<LoginView />} />
      <Route element={<RequireAuth />}>
        <Route path='/' element={<Layout />}>
          {/* Protected route */}
          <Route path='routes' element={<RoutesView />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
