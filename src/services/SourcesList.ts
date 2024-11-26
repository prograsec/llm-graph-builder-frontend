import api from '../API/Index';
import { NEO4J_DB, NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from '../utils/Credentials';
import { SourcesListApiResponse } from './SourcesList.types';

const encodedPassword = btoa(NEO4J_PASSWORD);

export async function getSources() {
  return (
    await api.get(`/sources_list`, {
      params: {
        uri: NEO4J_URI,
        userName: NEO4J_USERNAME,
        database: NEO4J_DB,
        password: encodedPassword,
      },
    })
  ).data as SourcesListApiResponse;
}
