import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { useQuery } from 'react-query';
import './App.css';
import CustomGraphViewModal from './components/Graph/CustomGraphViewModal.tsx';
import { getSources } from './services/SourcesList.ts';

import 'bootstrap/dist/css/bootstrap.min.css';
const App: React.FC = () => {
  const [graphViewOpen, setGraphViewOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(-1);
  const { data: sources, isLoading: sourcesLoading } = useQuery({ queryKey: ['sources-list'], queryFn: getSources });

  if (!sources) {
    return (
      <main className='h-dvh flex items-center justify-center gap-4 bg-[#7642d9]'>
        <Spinner animation='grow' variant='success'></Spinner>
        <Spinner animation='grow' variant='success'></Spinner>
        <Spinner animation='grow' variant='success'></Spinner>
      </main>
    );
  }

  return (
    <main className='p-4'>
      <p>Select a data source and click 'View Graph'</p>
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
          {sources.data.map((source, i) => (
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
      {selected !== -1 && (
        <Button onClick={() => setGraphViewOpen(true)} variant='success'>
          <Spinner animation='border' role='status' hidden={!sourcesLoading} size='sm' className='me-2' />
          View Graph
        </Button>
      )}
      {selected !== -1 && (
        <CustomGraphViewModal
          selectedRows={[sources.data[selected].fileName]}
          inspectedName={sources.data[selected].fileName}
          open={graphViewOpen}
          setGraphViewOpen={() => setGraphViewOpen((open) => !open)}
          viewPoint={'sample'}
        />
      )}
    </main>
  );
};

export default App;
