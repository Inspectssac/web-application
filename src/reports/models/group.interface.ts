export interface Group {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  reportTypeId: number
  fieldsGroups: []
}

export interface ReportGroup {
  id: number
  name: string
}
