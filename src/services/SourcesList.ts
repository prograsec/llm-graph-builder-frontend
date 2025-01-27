import api from '../API/Index';

import { SourcesListApiResponse } from './SourcesList.types';

export async function getSources(userId: string | null) {
  return (await api.get(`/list_uploaded_files/${userId ? `?user_id=${userId}` : ''}`)).data as SourcesListApiResponse;
}
