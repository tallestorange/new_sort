import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import { SORT_PATH, TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { Member, nameRenderFunction, profileRenderFunction, useHPDatabase } from "./hooks/useHPDatabase";
import { useMemo } from "react";
import SortPageShared from "./pages/SortPageShared";

export default function App() {
  const { initialState, setGroups, members, includeOG, setIncludeOG, includeTrainee, setIncludeTrainee, setDateRange, setExternalSortParam, shareURL } = useHPDatabase();

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
              setDateRangeChanged={setDateRange}
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage<Member> 
              members={members}
              share_url={shareURL}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
          />} />
          <Route path={`/sort_shared`} element={
            <SortPageShared<Member>
              members={members}
              share_url={shareURL}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
              set_custom_params={setExternalSortParam}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}