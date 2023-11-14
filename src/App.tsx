import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import { SORT_PATH, TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { MemberParsed, nameRenderFunction, profileRenderFunction, useHPDatabase } from "./hooks/useHPDatabase";

export default function App() {
  const { initialState, setGroups, members, includeOG, setIncludeOG } = useHPDatabase();

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
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage<MemberParsed> 
              members={members}
              initialized={true}
              name_render_function={nameRenderFunction}
              profile_render_function={profileRenderFunction}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}