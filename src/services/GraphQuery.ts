import { UserCredentials } from '../types';
import api from '../API/Index';

export const graphQueryAPI = async (
  userCredentials: UserCredentials,
  query_type: string,
  document_names: (string | undefined)[] | undefined
) => {
  try {
    const formData = new FormData();
    formData.append('uri', userCredentials?.uri ?? '');
    formData.append('database', userCredentials?.database ?? '');
    formData.append('userName', userCredentials?.userName ?? '');
    formData.append('password', userCredentials?.password ?? '');
    formData.append('query_type', query_type ?? 'entities');
    formData.append('document_names', JSON.stringify(document_names));

    const response = await api.post(`/graph_query`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log('Error Posting the Question:', error);
    throw error;
  }
};

export const customGraphQueryAPI = async (
  query_type: string,
  document_names: (string | undefined)[] | undefined
) => {
  const URI = "neo4j+s://3a1e9022.databases.neo4j.io";
  const DB = "neo4j";
  const USERNAME = "neo4j";
  const PASSWORD = "jyElcTqS_tJtEOgSUCc1Q3EmpQLdVDjyLyhn_y9yp98"

  try {
    const formData = new FormData();
    formData.append('uri', URI);
    formData.append('database', DB);
    formData.append('userName', USERNAME);
    formData.append('password', PASSWORD);
    formData.append('query_type', query_type ?? 'entities');
    formData.append('document_names', JSON.stringify(document_names));

    const response = await api.post(`/graph_query`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log('Error Posting the Question:', error);
    throw error;
  }
}

export const getNeighbors = async (userCredentials: UserCredentials, elementId: string) => {
  try {
    const formData = new FormData();
    formData.append('uri', userCredentials?.uri ?? '');
    formData.append('database', userCredentials?.database ?? '');
    formData.append('userName', userCredentials?.userName ?? '');
    formData.append('password', userCredentials?.password ?? '');
    formData.append('elementId', elementId);

    const response = await api.post(`/get_neighbours`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log('Error Posting the Question:', error);
    throw error;
  }
};
