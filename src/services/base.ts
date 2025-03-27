import type { AxiosInstance } from 'axios';
import type {
  ApiRequestParams,
  ApiResponseError,
  ApiResponseList,
} from '@/types/api.ts';

export class BaseRepository<T = any, R = any> {
  constructor(
    protected $axios: AxiosInstance,
    protected resource: string
  ) {}

  async show(params?: ApiRequestParams): Promise<ApiResponseList<T>> {
    return this.$axios.get(`/${this.resource}/`, { params });
  }

  async index(
    id: string | number,
    params: ApiRequestParams = {},
    pathParams: string = ''
  ): Promise<ApiResponseList<T>> {
    return this.$axios.get(`/${this.resource}/${id}/${pathParams}`, { params });
  }

  async create(
    payload: Record<string, Partial<R>> | FormData | null,
    { visibleFields = [] }: { visibleFields?: string[] } = {}
  ): Promise<T> {
    try {
      const response = await this.$axios.post(`/${this.resource}/`, payload);
      return response.data;
    } catch (error) {
      throw this.buildFormErrors(error as ApiResponseError, visibleFields);
    }
  }

  async update(
    id: string | number,
    payload: Partial<R> | FormData,
    { visibleFields = [] }: { visibleFields?: string[] } = {},
    pathParams: string = ''
  ): Promise<T> {
    try {
      const response = await this.$axios.put(`/${this.resource}/${id}/${pathParams}`, payload);
      return response.data;
    } catch (error) {
      throw this.buildFormErrors(error as ApiResponseError, visibleFields);
    }
  }

  async destroy(id: string | number): Promise<void> {
    await this.$axios.delete(`/${this.resource}/${id}/`);
  }

  // Xử lý lỗi form
  protected buildFormErrors(error: ApiResponseError, visibleFields: string[] = []) {
    const formErrors = visibleFields.reduce((acc, field) => {
      const errorItem = error.errors?.find((item) => item.field === field);
      if (errorItem) {
        acc[field] = errorItem.message;
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(formErrors).length > 0) {
      error.formErrors = formErrors;
    }
    return error;
  }
}
