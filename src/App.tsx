import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import { SORT_PATH, TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { MemberParsed, nameRenderFunction, profileRenderFunction, useHPDatabase } from "./hooks/useHPDatabase";
import { useMemo } from "react";

export default function App() {
  const { initialState, setGroups, members, includeOG, setIncludeOG, includeTrainee, setIncludeTrainee } = useHPDatabase();

  const initialized = useMemo(() => {
    return initialState.allgroups.initialized && initialState.groups_stored.initialized;
  }, [initialState]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Search
              initialState={initialState}
              target_members_count={members.size}
              setGroups={setGroups}
              includeOG={includeOG}
              setIncludeOG={setIncludeOG}
              includeTrainee={includeTrainee}
              setIncludeTrainee={setIncludeTrainee}
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage<MemberParsed> 
              members={members}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}