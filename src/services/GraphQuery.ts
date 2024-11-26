import { UserCredentials } from '../types';
import api from '../API/Index';
import { NEO4J_DB, NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from '../utils/Credentials';

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

export const customGraphQueryAPI = async (query_type: string, document_names: (string | undefined)[] | undefined) => {
  try {
    const formData = new FormData();
    formData.append('uri', NEO4J_URI);
    formData.append('database', NEO4J_DB);
    formData.append('userName', NEO4J_USERNAME);
    formData.append('password', NEO4J_PASSWORD);
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
