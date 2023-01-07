import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import LoginView from '@/iam/ui/pages/LoginView'
import RoutesView from '@/routes/pages/RoutesView'
import Layout from '@/shared/ui/components/Layout'
import NotFound from '@/shared/ui/pages/NotFound'
import Home from '@/shared/ui/pages/Home'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import UsersView from '@/admin/ui/pages/UsersView'
import ReportsView from '@/admin/ui/pages/ReportsView'
import FieldsView from '@/admin/ui/pages/FieldsView'
import ProfileView from '@/profiles/ui/pages/ProfileView'
import VehiclesView from '@/admin/ui/pages/VehiclesView'
import RequiredAdmin from '@/admin/ui/pages/RequiredAdmin'

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
    element: <RequiredAdmin />,
    children: [
      {
        path: 'users',
        element: <UsersView />
      },
      {
        path: 'reports',
        element: <ReportsView />
      },
      {
        path: 'fields',
        element: <FieldsView />
      },
      {
        path: 'vehicles',
        element: <VehiclesView />
      }
    ]
  },
  {
    path: 'profile',
    element: <ProfileView />
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
