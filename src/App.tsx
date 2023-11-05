import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home, { SortSetting } from './components/Home';
import { SORT_PATH, TITLE } from './components/Constants'
import Layout from "./components/Layout";
import SortPage from "./components/SortPage";
import useNPDatabase from "./hooks/useNPDatabase";

import "./App.css";

export default function App() {
  const {initial_params, current_params, members, setMembers} = useNPDatabase();
  const [sortConfig, setSortConfig] = useState<SortSetting>({ show_hobby: false, show_skill: false, show_ranking: false });

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={<Home
            onMemberUpdated={setMembers}
            onSortSettingsUpdated={setSortConfig}
            initial_params={initial_params}
            current_params={current_params}
          ></Home>} />
          <Route path={`/${SORT_PATH}`} element={<SortPage members={members} sortName={TITLE} sortConfig={sortConfig} />} />
        </Routes>
      </Layout>
    </Router>
  );
}