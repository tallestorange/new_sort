import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberSearch from './pages/MemberSearch';
import { TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { Member, nameRenderFunction, profileRenderFunction, useHPMemberDatabase } from "./hooks/useHPMemberDatabase";
import { useCallback, useMemo } from "react";
import SortPageShared from "./pages/SortPageShared";
import Home from "./pages/Home";
import SongSearch from "./pages/SongSearch";
import { useHPSongsDatabase } from "./hooks/useHPSongsDatabase";

export default function App() {
  const { initialState: initialStateMember, setGroups, members, setIncludeOG, setIncludeTrainee, setDateRange, setExternalSortParam, shareURL, setMemberDBInitialized } = useHPMemberDatabase();
  const { initialState: initialiStateSong, setSongDBInitialized } = useHPSongsDatabase();

  const initialized = useMemo(() => {
    return initialStateMember.allgroups.initialized && initialStateMember.groups_stored.initialized;
  }, [initialStateMember]);

  const initializeMemberDB = useCallback(() => {
    setMemberDBInitialized(true);
  }, [setMemberDBInitialized]);

  const initializeSongDB = useCallback(() => {
    setSongDBInitialized(true);
  }, [setSongDBInitialized]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Home
          />} />
          <Route path="/search_members" element={
            <MemberSearch
              initialState={initialStateMember}
              target_members_count={members.size}
              setGroups={setGroups}
              setIncludeOG={setIncludeOG}
              setIncludeTrainee={setIncludeTrainee}
              setDateRangeChanged={setDateRange}
              initializeFunction={initializeMemberDB}
          />} />
          <Route path="/search_songs" element={
            <SongSearch
              initialState={initialiStateSong}
              target_songs_count={initialiStateSong.all_songs.item.length}
              setDateRangeChanged={setDateRange}
              initializeFunction={initializeSongDB}
          />} />
          <Route path={`/sort_members`} element={
            <SortPage<Member> 
              members={members}
              share_url={initialStateMember.share_url.item}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
              initialize_function={initializeMemberDB}
          />} />
          <Route path={`/sort_members_shared`} element={
            <SortPageShared<Member>
              members={members}
              share_url={shareURL}
              initialized={initialized}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
              set_custom_params={setExternalSortParam}
              initialize_function={initializeMemberDB}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}