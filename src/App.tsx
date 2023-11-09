import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import { SORT_PATH, TITLE } from './components/Constants'
import Layout from "./components/Layout";
import SortPage from "./components/SortPage";
import useNPDatabase from "./hooks/useNPDatabase";

import "./App.css";

export default function App() {
  const {
    initial_state,
    can_vote_only,
    setMBTIs,
    setBirthPlaces,
    setHeights,
    setYears,
    setCanVote,
    members,
    sort_settings,
    setSortSettings
  } = useNPDatabase();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Home
              initial_state={initial_state}
              can_vote_only={can_vote_only}
              target_members_count={members.length}
              setMBTIs={setMBTIs}
              setBirthPlaces={setBirthPlaces}
              setHeights={setHeights}
              setYears={setYears}
              setCanVote={setCanVote}
              onSortSettingsUpdated={setSortSettings}
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage 
              members={members} 
              sortName={TITLE} 
              sortConfig={sort_settings} 
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}