import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import './App.css';
import CustomGraphViewModal from './components/Graph/CustomGraphViewModal.tsx';
import { getSources } from './services/SourcesList.ts';

import 'bootstrap/dist/css/bootstrap.min.css';
import api from './API/Index.ts';
import { Alert, FormControl, Spinner } from 'react-bootstrap';
import { SourceInfo } from './services/SourcesList.types.ts';
import NotLoggedInPage from './NotLoggedIn.tsx';

async function uploadFile({ file, userId }: { file: File; userId: string }) {
  const numberOfMBsRoundedUp = Math.ceil(file.size / 1024 / 1024);

  for (let i = 0; i < numberOfMBsRoundedUp; i++) {
    const start = i * 1024 * 1024;
    const end = Math.min((i + 1) * 1024 * 1024, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunk_number', (i + 1).toString());
    formData.append('total_chunks', numberOfMBsRoundedUp.toString());
    formData.append('original_name', file.name);
    formData.append('model', 'openai_gpt_4o_mini');
    formData.append('user_id', userId);

    await api.postForm('/upload_knowledge_file/', formData);
  }
}

async function extractKnowledgeGraph({ file, userId }: { file: File; userId: string }) {
  const formData = new FormData();
  formData.append('model', 'openai_gpt_4o_mini');
  formData.append('file_name', file.name);
  formData.append('source_type', 'local file');
  formData.append('user_id', userId);

  await api.postForm('/extract_knowledge_graph/', formData);
}

async function deleteSource({ source, userId }: { source: SourceInfo; userId: string }) {
  const formData = new FormData();
  formData.append('filenames', JSON.stringify([source.fileName]));
  formData.append('source_types', '["local file"]');
  formData.append('delete_entities', 'true');
  formData.append('user_id', userId);

  await api.postForm('/delete_knowledge_file/', formData);
}

const QUERY_KEY = {
  SOURCES_LIST: 'sources_list',
};

const App: React.FC = () => {
  const userId = new URLSearchParams(window.location.search).get('token') || '';
  const queryClient = useQueryClient();

  const { data: authenticatd, isLoading: authenticationLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return (await api.get(`/api/user${userId ? `?user_id=${userId}` : ''}`)).data.user_exists || false;
    },
  });

  const {
    data: sources,
    isLoading: sourcesAreLoading,
    isFetching: sourcesAreFetching,
  } = useQuery({
    queryKey: [QUERY_KEY.SOURCES_LIST],
    queryFn: getSources.bind(null, userId),
  });
  const uploadFileMutation = useMutation({ mutationFn: uploadFile });
  const extractKnowledgeGraphMutation = useMutation({
    mutationFn: extractKnowledgeGraph,
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY.SOURCES_LIST]),
  });
  const deleteSourceMutation = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY.SOURCES_LIST]),
  });

  const [file, setFile] = useState<File | undefined>();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [graphViewOpen, setGraphViewOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(-1);

  const status = (() => {
    if (uploadFileMutation.isLoading) {
      return 'File is being uploaded';
    } else if (extractKnowledgeGraphMutation.isLoading) {
      return 'Knowledge graph is being extracted from file';
    } else if (deleteSourceMutation.isLoading) {
      return 'File is being deleted';
    } else if (sourcesAreLoading) {
      return 'Sources are being loaded';
    } else if (sourcesAreFetching) {
      return 'Sources are reloading';
    }
    return 'All systems running well.';
  })();

  const isLoading = status !== 'All systems running well.';

  const fileSelected = file !== undefined;

  if (authenticationLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Spinner className='text-light-discovery-icon' />
      </div>
    );
  }

  if (!userId || !authenticatd) {
    return <NotLoggedInPage />;
  }

  return (
    <>
      <main className='p-4'>
        <Alert className='flex items-center gap-2'>
          {isLoading ? <Spinner size='sm' /> : <p className='-mb-0.5 text-[14px]'>&#9989;</p>}
          {status}
        </Alert>
        <hr></hr>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!(fileUploadRef.current && file)) {
              return;
            }

            await uploadFileMutation.mutateAsync({ file, userId });
            await extractKnowledgeGraphMutation.mutateAsync({ file, userId });

            fileUploadRef.current.value = '';
            setFile(undefined);
          }}
        >
          <FormControl
            className='mb-3'
            type='file'
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) {
                return;
              }
              setFile(file);
            }}
            ref={fileUploadRef}
          />
          <Button type='submit' disabled={!fileSelected}>
            Upload File
          </Button>
        </form>

        <hr></hr>
        <p>Select a data source and click 'View Graph'</p>
        <Button
          className='mb-3 -mt-1'
          disabled={selected === -1}
          onClick={() => setGraphViewOpen(true)}
          variant='success'
        >
          View Graph
        </Button>
        <Button
          className='mb-3 ml-2 -mt-1'
          disabled={selected === -1}
          onClick={async () => {
            if (!sources || selected === -1) {
              return;
            }
            await deleteSourceMutation.mutateAsync({ source: sources.data[selected], userId });
            setSelected(-1);
          }}
          variant='danger'
        >
          Delete File
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Selected</th>
              <th>File Name</th>
              <th>Model</th>
              <th>Node Count</th>
              <th>Relationships Count</th>
            </tr>
          </thead>
          <tbody>
            {sources &&
              sources.data.map((source, i) => (
                <tr key={source.fileName}>
                  <td className='max-w-max' onClick={() => setSelected(i)}>
                    <input type='checkbox' checked={selected === i} />
                  </td>
                  <td>{source.fileName}</td>
                  <td>{source.model}</td>
                  <td>{source.nodeCount}</td>
                  <td>{source.relationshipCount}</td>
                </tr>
              ))}
          </tbody>
        </Table>

        {selected !== -1 && sources && (
          <CustomGraphViewModal
            userId={userId}
            selectedRows={[sources.data[selected].fileName]}
            inspectedName={sources.data[selected].fileName}
            open={graphViewOpen}
            setGraphViewOpen={() => setGraphViewOpen((open) => !open)}
            viewPoint={'sample'}
          />
        )}
      </main>
    </>
  );
};

export default App;
