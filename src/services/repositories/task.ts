import type { NamedObject } from '@/types/common/common_types'
import type { Task, TaskCreateEditPayload } from '@/types/task/task'
import api from '../api'
import { BaseRepository } from '../base'

class TaskRepository extends BaseRepository<Task, TaskCreateEditPayload> {
  constructor() {
    super(api, 'tasks')
  }
}

class TaskStatusRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'tasks/statuses')
  }
}

class PriorityRepository extends BaseRepository<NamedObject, Partial<NamedObject>> {
  constructor() {
    super(api, 'tasks/priorities')
  }
}

export const taskRepository = new TaskRepository()
export const taskStatusRepository = new TaskStatusRepository()
export const prioriryRepository = new PriorityRepository()
