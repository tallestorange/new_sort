import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberSearch from './pages/MemberSearch';
import { TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { nameRenderFunction, profileRenderFunction, useHPMemberDatabase } from "./hooks/useHPMemberDatabase";
import { useCallback, useMemo } from "react";
import SortPageShared from "./pages/SortPageShared";
import Home from "./pages/Home";
import SongSearch from "./pages/SongSearch";
import { useHPSongsDatabase } from "./hooks/useHPSongsDatabase";
import { Member } from "./modules/CSVLoader";
import React from "react";

export default function App() {
  const { initialState: initialStateMember, setGroups, members, setIncludeOG, setIncludeTrainee, setDateRange: setMembersDateRange, setExternalSortParam, shareURL, setMemberDBInitialized } = useHPMemberDatabase();
  const { initialState: initialiStateSong, setSongDBInitialized, songs, setDateRange: setSongsDateRange, setIncludeSingle, setIncludeAlbum, setLabels, setArtists } = useHPSongsDatabase();

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
              setDateRangeChanged={setMembersDateRange}
              initializeFunction={initializeMemberDB}
          />} />
          <Route path="/search_songs" element={
            <SongSearch
              initialState={initialiStateSong}
              target_songs_count={songs.size}
              setDateRangeChanged={setSongsDateRange}
              initializeFunction={initializeSongDB}
              setIncludeAlbum={setIncludeAlbum}
              setIncludeSingle={setIncludeSingle}
              setLabels={setLabels}
              setArtists={setArtists}
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