import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from 'src/components/Layout';
import AnamnesisList from 'src/pages/AnamnesisList';
import AnamnesisDetail from 'src/pages/AnamnesisDetail';
import CreateAnamnesisForm from 'src/pages/AnamnesisForm/Create';
import UpdateAnamnesisForm from 'src/pages/AnamnesisForm/Update';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AnamnesisList />} />
          <Route path="detail/:id" element={<AnamnesisDetail />} />
          <Route path="create" element={<CreateAnamnesisForm />} />
          <Route path="update/:id" element={<UpdateAnamnesisForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
