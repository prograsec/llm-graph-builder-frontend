import './App.css';
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { useState } from 'react';
import CustomGraphViewModal from './components/Graph/CustomGraphViewModal.tsx';

const App: React.FC = () => {
  const [graphViewOpen, setGraphViewOpen] = useState<boolean>(true);

  return (
    <CustomGraphViewModal
      selectedRows={['mvc.pdf']}
      inspectedName={'mvc.pdf'}
      open={graphViewOpen}
      setGraphViewOpen={() => setGraphViewOpen((open) => !open)}
      viewPoint={'sample'}
    />
  );
};

export default App;
