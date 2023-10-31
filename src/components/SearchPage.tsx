import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import npDB from "../modules/NPDatabase";
import Grid from "@material-ui/core/Grid";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';
import {VERSION} from './Constants';

interface Props {
  onUpdated: (members: string[]) => void;
}

export default function SearchPage(props: Props) {
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

    const [mbtis, setMBTIs] = useState<string[]>(mbtis_stored);
    const [birthplaces, setBirthPlaces] = useState<string[]>(all_birthplaces_stored);
    const [heights, setHeights] = useState<string[]>(all_heights_stored);
    const [years, setYears] = useState<string[]>(all_birthyears_stored);
    const [members, setMembers] = useState<string[]>([]);

    useEffect(() => {
      const members_result = npDB.search(mbtis, birthplaces, heights, years);
      setMembers(members_result);
      props.onUpdated(members_result)
      console.log(VERSION);
      // eslint-disable-next-line
    },[mbtis, birthplaces, heights, years])

    useEffect(() => {
      localStorage.setItem("mbtis", JSON.stringify(mbtis))
    },[mbtis])

    useEffect(() => {
      localStorage.setItem("birthplaces", JSON.stringify(birthplaces))
    },[birthplaces])

    useEffect(() => {
      localStorage.setItem("heights", JSON.stringify(heights))
    },[heights])

    useEffect(() => {
      localStorage.setItem("years", JSON.stringify(years))
    },[years])

    return (
        <Grid container item xs={12} justifyContent="center" spacing={1}>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="MBTI" items={all_mbtis} default_selected={mbtis_stored} onSubmit={setMBTIs}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="出身地" items={all_birthplaces} default_selected={all_birthplaces_stored} onSubmit={setBirthPlaces}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="身長" items={all_heights} default_selected={all_birthyears_stored} onSubmit={setHeights}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="生まれ年" items={all_birthyears} default_selected={all_birthyears_stored} onSubmit={setYears}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <Typography variant="h6" component="h2">
                該当者: {members.length}名
              </Typography>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <Button 
              to="np"
              component={Link}
              disabled={members.length === 0}
              color="secondary"
              >
                ソート開始
              </Button>
            </Grid>
        </Grid>
    );
}