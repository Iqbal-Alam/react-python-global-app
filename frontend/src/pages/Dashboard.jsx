import React from 'react';
import Layout from '../components/layout/Layout';
import AddMedicinePage from './AddMedicinePage';
import MedicineDetailView from '../components/views/MedicineDetailView';

function Dashboard() {
  return (
    <Layout>
      {/* <AddMedicinePage /> */}
      <MedicineDetailView />
    </Layout>
  );
}

export default Dashboard;
