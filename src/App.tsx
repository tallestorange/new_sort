import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberSearch from './pages/MemberSearch';
import { TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { Member, nameRenderFunction, profileRenderFunction, useHPDatabase } from "./hooks/useHPMemberDatabase";
import { useCallback, useMemo } from "react";
import SortPageShared from "./pages/SortPageShared";
import Home from "./pages/Home";
import SongSearch from "./pages/SongSearch";

export default function App() {
  const { initialState, setGroups, members, setIncludeOG, setIncludeTrainee, setDateRange, setExternalSortParam, shareURL, setMemberDBInitialized } = useHPDatabase();

  const initialized = useMemo(() => {
    return initialState.allgroups.initialized && initialState.groups_stored.initialized;
  }, [initialState]);

  const initializeSongDB = useCallback(() => {
    setMemberDBInitialized(true);
  }, [setMemberDBInitialized]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Home
          />} />
          <Route path="/search_members" element={
            <MemberSearch
              initialState={initialState}
              target_members_count={members.size}
              setGroups={setGroups}
              setIncludeOG={setIncludeOG}
              setIncludeTrainee={setIncludeTrainee}
              setDateRangeChanged={setDateRange}
              initializeFunction={initializeSongDB}
          />} />
          <Route path="/search_songs" element={
            <SongSearch
              initialState={initialState}
              target_songs_count={0}
              setGroups={setGroups}
              setDateRangeChanged={setDateRange}
          />} />
          <Route path={`/sort_members`} element={
            <SortPage<Member> 
              members={members}
              share_url={initialState.share_url.item}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
              initialize_function={initializeSongDB}
          />} />
          <Route path={`/sort_members_shared`} element={
            <SortPageShared<Member>
              members={members}
              share_url={shareURL}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
              set_custom_params={setExternalSortParam}
              initialize_function={initializeSongDB}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}