export interface Material {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface MaterialDto extends Pick<Material, 'name'> {}
