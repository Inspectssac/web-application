export interface User {
  updatedAt: string
  createdAt: string
  id: string
  username: string
  password: string
  active: boolean
  role: string
  areas: Area[]
}

export interface Area {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}
