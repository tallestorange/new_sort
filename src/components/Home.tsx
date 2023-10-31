import Grid from "@material-ui/core/Grid";
import "../App.css";
import {TITLE} from './Constants';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import npDB from "../modules/NPDatabase";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';

interface Props {
  onUpdated: (members: string[]) => void;
  initial_mbtis: string[];
  initial_birthplaces: string[];
  initial_heights: string[];
  initial_birthyears: string[];
  all_mbtis: string[];
  all_birthplaces: string[];
  all_heights: string[];
  all_birthyears: string[];
}

export default function SearchPage(props: Props) {
  const [mbtis, setMBTIs] = useState<string[]>(props.initial_mbtis);
  const [birthplaces, setBirthPlaces] = useState<string[]>(props.initial_birthplaces);
  const [heights, setHeights] = useState<string[]>(props.initial_heights);
  const [years, setYears] = useState<string[]>(props.initial_birthyears);
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const members_result = npDB.search(mbtis, birthplaces, heights, years);
    setMembers(members_result);
    props.onUpdated(members_result)
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
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={3}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>(最終更新:23/10/31 各種処理の最適化)</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
          title="MBTI" 
          items={props.all_mbtis} 
          default_selected={props.initial_mbtis}
          sort={true}
          onSubmit={setMBTIs}/>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
          title="出身地" 
          items={props.all_birthplaces} 
          default_selected={props.initial_birthplaces} 
          sort={false}
          onSubmit={setBirthPlaces}/>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
          title="身長" 
          items={props.all_heights} 
          default_selected={props.initial_heights}
          sort={true}
          onSubmit={setHeights}/>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
          title="生まれ年" 
          items={props.all_birthyears}
          default_selected={props.initial_birthyears}
          sort={true}
          onSubmit={setYears}/>
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
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}