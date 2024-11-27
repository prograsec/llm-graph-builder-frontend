import './App.css';
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { useEffect, useState } from 'react';
import CustomGraphViewModal from './components/Graph/CustomGraphViewModal.tsx';
import { useQuery } from 'react-query';
import { getSources } from './services/SourcesList.ts';

function toggleCheck(checkboxes: boolean[], index: number) {
  if (index < 0 || index >= checkboxes.length) return checkboxes;
  return checkboxes.map((checkbox, i) => (index === i ? !checkbox : checkbox));
}

const App: React.FC = () => {
  const [graphViewOpen, setGraphViewOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(-1);
  const { data: sources, isLoading: sourcesLoading } = useQuery({ queryKey: ['sources-list'], queryFn: getSources });

  if (!sources) {
    return <p>Loading sources</p>;
  }

  return (
    <>
      <table className='text-left w-full'>
        <thead>
          <tr>
            <th>Selected</th>
            <th>File Name</th>
          </tr>
        </thead>
        <tbody>
          {sources.data.map((source, i) => (
            <tr key={source.fileName}>
              <td>
                <input type='checkbox' checked={selected === i} onClick={() => setSelected(i)} />
              </td>
              <td>{source.fileName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected !== -1 && <button onClick={() => setGraphViewOpen(true)}>View Graph</button>}
      {selected !== -1 && (
        <CustomGraphViewModal
          selectedRows={[sources.data[selected].fileName]}
          inspectedName={sources.data[selected].fileName}
          open={graphViewOpen}
          setGraphViewOpen={() => setGraphViewOpen((open) => !open)}
          viewPoint={'sample'}
        />
      )}
    </>
  );
};

export default App;
