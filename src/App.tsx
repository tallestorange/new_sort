import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberSearch from './pages/MemberSearch';
import { TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { nameRenderFunction as memberNameRenderFunction, profileRenderFunction as memberProfileRenderFunction, useHPMemberDatabase } from "./hooks/useHPMemberDatabase";
import { useCallback, useMemo } from "react";
import SortPageShared from "./pages/SortPageShared";
import Home from "./pages/Home";
import SongSearch from "./pages/SongSearch";
import { nameRenderFunction as songNameRenderFunction, profileRenderFunction as songProfileRenderFunction,  useHPSongsDatabase } from "./hooks/useHPSongsDatabase";
import { Member, Song } from "./modules/CSVLoader";
import React from "react";

export default function App() {
  const { initialState: initialStateMember, setGroups, members, setIncludeOG, setIncludeTrainee, setDateRange: setMembersDateRange, setExternalSortParam, shareURL, setMemberDBInitialized, setEnableArtistsSearch: setUseArtistSearch } = useHPMemberDatabase();
  const { initialState: initialiStateSong, setSongDBInitialized, songs, setDateRange: setSongsDateRange, setIncludeSingle, setIncludeAlbum, setArtists, setArrangers, setComposers, setLyricists, setEnableArrangersSearch, setEnableComposersSearch, setEnableLyricistsSearch, setEnableArtistsSearch } = useHPSongsDatabase();

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
              setEnableArtistsSearch={setUseArtistSearch}
          />} />
          <Route path="/search_songs" element={
            <SongSearch
              initialState={initialiStateSong}
              target_songs_count={songs.size}
              setDateRangeChanged={setSongsDateRange}
              initializeFunction={initializeSongDB}
              setIncludeAlbum={setIncludeAlbum}
              setIncludeSingle={setIncludeSingle}
              setArtists={setArtists}
              setArrangers={setArrangers}
              setComposers={setComposers}
              setLyricists={setLyricists}
              setEnableArrangersSearch={setEnableArrangersSearch}
              setEnableComposersSearch={setEnableComposersSearch}
              setEnableLyricistsSearch={setEnableLyricistsSearch}
              setEnableArtistsSearch={setEnableArtistsSearch}
          />} />
          <Route path={`/sort_members`} element={
            <SortPage
              members={members}
              share_url={initialStateMember.share_url.item}
              initialized={initialized}
              name_render_function={memberNameRenderFunction}
              profile_render_function={memberProfileRenderFunction}
              initialize_function={initializeMemberDB}
              tweet_button_enabled={true}
              show_result_pictures={true}
          />} />
          <Route path={`/sort_songs`} element={
            <SortPage
              members={songs}
              initialized={initialiStateSong.all_artists.initialized}
              name_render_function={songNameRenderFunction}
              profile_render_function={songProfileRenderFunction}
              initialize_function={initializeSongDB}
              tweet_button_enabled={true}
              show_result_pictures={false}
          />} />
          <Route path={`/sort_members_shared`} element={
            <SortPageShared
              members={members}
              share_url={shareURL}
              initialized={initialized}
              name_render_function={memberNameRenderFunction}
              profile_render_function={memberProfileRenderFunction}
              set_custom_params={setExternalSortParam}
              initialize_function={initializeMemberDB}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}