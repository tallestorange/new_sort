import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import { SORT_PATH, TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";
import useNPDatabase from "./hooks/useNPDatabase";

import "./App.css";
import { useMemo } from "react";

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
  } = useNPDatabase();

  const initialized = useMemo(() => {
    const v1 = initial_state.current_birthplaces.initialized && initial_state.current_birthyears.initialized && initial_state.current_heights.initialized && initial_state.current_mbtis.initialized;
    const v2 = initial_state.initial_birthplaces.initialized && initial_state.initial_birthyears.initialized && initial_state.initial_heights.initialized && initial_state.initial_mbtis.initialized;
    return v1 && v2;
  }, [initial_state]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Search
              initial_state={initial_state}
              can_vote_only={can_vote_only}
              target_members_count={members.size}
              setMBTIs={setMBTIs}
              setBirthPlaces={setBirthPlaces}
              setHeights={setHeights}
              setYears={setYears}
              setCanVote={setCanVote}
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage 
              members={members}
              sortName={TITLE}
              initialized={initialized}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}