import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from './pages/Search';
import { SORT_PATH, TITLE } from './modules/Constants'
import Layout from "./components/Layout";
import SortPage from "./pages/SortPage";

import "./App.css";
import { MemberParsed, useHPDatabase } from "./hooks/useHPDatabase";
import { formatDate } from "./modules/DateUtils";

export default function App() {
  const { allgroups, setGroups, members } = useHPDatabase();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={
            <Search
              allgroups={allgroups}
              target_members_count={members.size}
              setGroups={setGroups}
          />} />
          <Route path={`/${SORT_PATH}`} element={
            <SortPage<MemberParsed> 
              members={members}
              sortName={TITLE}
              initialized={true}
              name_render_function={(v) => { return v.memberName }}
              profile_render_function={(v) => {
                const res:string[] = [
                  `誕生日: ${formatDate(v.birthDate)}`,
                  `H!P加入日: ${formatDate(v.HPjoinDate)}`,
                  `デビュー日: ${v.debutDate ? formatDate(v.debutDate) : "N/A"}`,
                ];
                return res;
              }}
          />} />
        </Routes>
      </Layout>
    </Router>
  );
}