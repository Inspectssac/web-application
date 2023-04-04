export interface Group {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  reportTypeId: string
  fieldsGroups: []
}

export interface ReportGroup {
  id: string
  name: string
}
