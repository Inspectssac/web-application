export interface Profile {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  lastName: string
  dni: string
  company: string
  phone1: string
  phone2: string
  email: string
  license: string
  licenseCategory: string
  fullName: string
}

export type ProfileDto = Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'fullName'>
