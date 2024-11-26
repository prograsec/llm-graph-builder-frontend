import './App.css';
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { useEffect, useState } from 'react';
import CustomGraphViewModal from './components/Graph/CustomGraphViewModal.tsx';
import { useQuery } from 'react-query';
import { getSources } from './services/SourcesList.ts';

const App: React.FC = () => {
  const [graphViewOpen, setGraphViewOpen] = useState<boolean>(false);
  const { data: sources, isLoading: sourcesLoading } = useQuery({ queryKey: ['sources-list'], queryFn: getSources });
  const [selected, setSelected] = useState<boolean[]>([]);

  if (!sources) {
    return <p>Loading sources</p>;
  }

  useEffect(() => {
    if (sources) {
      setSelected(sources.data.map((_) => false));
    }
  }, [sources]);
  

  return (
    <>
    <table>
      {sources.data.map((source, i) => <tr>
        <td>{source.}</td>
      </tr>)}
    </table>
      <CustomGraphViewModal
        selectedRows={['mvc.pdf']}
        inspectedName={'mvc.pdf'}
        open={graphViewOpen}
        setGraphViewOpen={() => setGraphViewOpen((open) => !open)}
        viewPoint={'sample'}
      />
    </>
  );
};

export default App;
