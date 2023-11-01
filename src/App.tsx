import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home, { SortSetting } from './components/Home';
import { TITLE, VERSION } from './components/Constants'
import npDB from "./modules/NPDatabase";
import Layout from "./components/Layout";
import SortPage from "./components/SortPage";

import "./App.css";

export default function App() {
  const all_mbtis = npDB.allMBTI;
  const all_birthplaces = npDB.allBirthPlace;
  const all_heights = npDB.allHeights;
  const all_birthyears = npDB.allYears;

  const storaged_version = localStorage.getItem("VERSION")
  if (storaged_version !== VERSION) {
    localStorage.setItem("mbtis", JSON.stringify(all_mbtis))
    localStorage.setItem("birthplaces", JSON.stringify(all_birthplaces))
    localStorage.setItem("heights", JSON.stringify(all_heights))
    localStorage.setItem("years", JSON.stringify(all_birthyears))
  }
  localStorage.setItem("VERSION", VERSION);

  let mbtis_stored: string[] = JSON.parse(localStorage.getItem("mbtis") || "");
  let all_birthplaces_stored: string[] = JSON.parse(localStorage.getItem("birthplaces") || "");
  let all_heights_stored: string[] = JSON.parse(localStorage.getItem("heights") || "");
  let all_birthyears_stored: string[] = JSON.parse(localStorage.getItem("years") || "");

  const [members, setMembers] = useState<string[]>(npDB.search(mbtis_stored, all_birthplaces_stored, all_heights_stored, all_birthyears_stored));
  const [sortConfig, setSortConfig] = useState<SortSetting>({ show_hobby: false, show_skill: false });

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Layout title={TITLE}>
        <Routes>
          <Route path="/" element={<Home
            onMemberUpdated={setMembers}
            onSortSettingsUpdated={setSortConfig}
            initial_mbtis={mbtis_stored}
            initial_birthplaces={all_birthplaces_stored}
            initial_heights={all_heights_stored}
            initial_birthyears={all_birthyears_stored}
            all_mbtis={all_mbtis}
            all_birthplaces={all_birthplaces}
            all_heights={all_heights}
            all_birthyears={all_birthyears}
          ></Home>} />
          <Route path="/np" element={<SortPage members={members} sortName={TITLE} sortConfig={sortConfig} />} />
        </Routes>
      </Layout>
    </Router>
  );
}