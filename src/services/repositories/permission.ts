import type {
  Group,
  GroupCreateEditPayload,
  GroupPermissions,
} from '@/types/permissions/permission'
import api from '../api'
import { BaseRepository } from '../base'

class GroupRepository extends BaseRepository<Group, GroupCreateEditPayload> {
  constructor() {
    super(api, 'group')
  }
}

class GroupPermissionRepository extends BaseRepository<
  GroupPermissions,
  Partial<GroupPermissions>
> {
  constructor() {
    super(api, 'group/permissions')
  }
}

export const groupRepository = new GroupRepository()
export const groupPermissionRepository = new GroupPermissionRepository()
