import api from '../API/Index';

import { SourcesListApiResponse } from './SourcesList.types';

export async function getSources() {
  return (await api.get(`/list_uploaded_files`)).data as SourcesListApiResponse;
}
