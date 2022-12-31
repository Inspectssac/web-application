import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './iam/pages/Login'
import RoutesView from './routes/pages/RoutesView'
import Home from './shared/components/Home'
import Layout from './shared/components/Layout'
import RequireAuth from './shared/components/RequiredAuth'
function App (): ReactElement {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />

        {/* Protected route */}
        <Route element={ <RequireAuth />}>
          <Route path='routes' element={ <RoutesView />}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
