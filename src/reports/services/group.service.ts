import { AppServices } from '@/shared/service/app-api.service'
import { GroupField } from '../models/group-field.interface'
import { Group } from '../models/group.interface'
import { GroupFieldDto } from '../models/interfaces/group-field-dto.interface'

export class GroupsService extends AppServices {
  constructor () {
    super({ baseUrl: 'groups', contentType: 'application/json' })
  }

  findAll = async (): Promise<Group[]> => {
    return await this.get<Group[]>('')
      .then(response => response.data)
  }

  update = async (id: number, group: Pick<Group, 'name'>): Promise<Group> => {
    console.log(group)
    return await this.patch<Group>(`/${id}`, group)
      .then(response => response.data)
  }

  remove = async (id: number): Promise<Group> => {
    return await this.delete<Group>(`/${id}`)
      .then(response => response.data)
  }

  findAllFields = async (groupId: number): Promise<GroupField[]> => {
    return await this.get<GroupField[]>(`/${groupId}/fields`)
      .then(response => response.data)
  }

  assignField = async (groupId: number, fieldId: number, groupFieldDto: GroupFieldDto): Promise<GroupField> => {
    return await this.post<GroupField>(`/${groupId}/fields/${fieldId}`, groupFieldDto)
      .then(response => response.data)
  }

  updateField = async (groupId: number, fieldId: number, groupFieldDto: GroupFieldDto): Promise<GroupField> => {
    return await this.patch<GroupField>(`/${groupId}/fields/${fieldId}`, groupFieldDto)
      .then(response => response.data)
  }

  deleteField = async (groupId: number, fieldId: number): Promise<GroupField> => {
    return await this.delete<GroupField>(`/${groupId}/fields/${fieldId}`)
      .then(response => response.data)
  }
}
