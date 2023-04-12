export interface Profile {
  createdAt: string
  updatedAt: string
  active: boolean
  id: string
  name: string
  lastName: string
  dni: string
  company: string
  companyWhoHires: string
  phone1: string
  phone2: string
  email: string
  license: string
  licenseCategory: string
  licenseExpiration: string
  fullName: string
}

export type ProfileDto = Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'fullName'>
