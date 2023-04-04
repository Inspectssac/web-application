export interface Material {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface MaterialDto extends Pick<Material, 'name'> {}
