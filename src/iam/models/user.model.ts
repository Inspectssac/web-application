export interface User {
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
}
