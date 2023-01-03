import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import LoginView from '@/iam/ui/pages/LoginView'
import RoutesView from '@/routes/pages/RoutesView'
import Layout from '@/shared/ui/components/Layout'
import NotFound from '@/shared/ui/pages/NotFound'
import Home from '@/shared/ui/pages/Home'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import AdminView from '@/admin/ui/pages/AdminView'

const authRequiredRoutes: RouteObject[] = [
  {
    index: true,
    path: 'home',
    element: <Home />
  },
  {
    path: 'routes',
    element: <RoutesView />
  },
  {
    path: 'admin',
    element: <AdminView />
  }
]

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: authRequiredRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router
