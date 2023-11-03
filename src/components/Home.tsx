import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, BOARDER } from './Constants';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import npDB from "../modules/NPDatabase";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface Props {
  onMemberUpdated?: (members: string[]) => void;
  onSortSettingsUpdated?: (setting: SortSetting) => void;
  initial_mbtis: string[];
  initial_birthplaces: string[];
  initial_heights: string[];
  initial_birthyears: string[];
  all_mbtis: string[];
  all_birthplaces: string[];
  all_heights: string[];
  all_birthyears: string[];
  can_vote_only: boolean;
}

export interface SortSetting {
  show_hobby: boolean;
  show_skill: boolean;
  show_ranking: boolean;
}

export default function Home(props: Props) {
  const [mbtis, setMBTIs] = useState<string[]>(props.initial_mbtis);
  const [birthplaces, setBirthPlaces] = useState<string[]>(props.initial_birthplaces);
  const [heights, setHeights] = useState<string[]>(props.initial_heights);
  const [years, setYears] = useState<string[]>(props.initial_birthyears);
  const [members, setMembers] = useState<string[]>([]);

  const [showHobby, setShowHobby] = useState<boolean>(false);
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showSkill, setShowSkill] = useState<boolean>(false);
  const [canVote, setCanVote] = useState<boolean>(props.can_vote_only);

  useEffect(() => {
    const members_result = npDB.search(mbtis, birthplaces, heights, years, canVote);
    setMembers(members_result);
    props.onMemberUpdated?.(members_result);
    // eslint-disable-next-line
  }, [mbtis, birthplaces, heights, years, canVote])

  useEffect(() => {
    localStorage.setItem("mbtis", JSON.stringify(mbtis))
  }, [mbtis])

  useEffect(() => {
    localStorage.setItem("birthplaces", JSON.stringify(birthplaces))
  }, [birthplaces])

  useEffect(() => {
    localStorage.setItem("heights", JSON.stringify(heights))
  }, [heights])

  useEffect(() => {
    localStorage.setItem("years", JSON.stringify(years))
  }, [years])

  useEffect(() => {
    localStorage.setItem("can_vote_only", JSON.stringify(canVote))
  }, [canVote])

  useEffect(() => {
    props.onSortSettingsUpdated?.({ show_hobby: showHobby, show_skill: showSkill, show_ranking: showRanking })
    // eslint-disable-next-line
  }, [showHobby, showSkill, showRanking])

  useEffect(() => {
    console.log("笠原桃奈さん1位おめでとうございます!!");
  }, [])

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={3}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>(最終更新:23/11/3 順位変動を表示する機能の追加)</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="MBTI"
            id="mbti"
            items={props.all_mbtis}
            default_selected={props.initial_mbtis}
            sort={true}
            onSubmit={setMBTIs} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="出身地"
            id="birthplace"
            items={props.all_birthplaces}
            default_selected={props.initial_birthplaces}
            sort={false}
            onSubmit={setBirthPlaces} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="身長"
            id="height"
            items={props.all_heights}
            default_selected={props.initial_heights}
            sort={true}
            onSubmit={setHeights} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="生まれ年"
            id="birthyear"
            items={props.all_birthyears}
            default_selected={props.initial_birthyears}
            sort={true}
            onSubmit={setYears} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <Typography variant="h6" component="h2">
            該当者: {members.length}名
          </Typography>
        </Grid>
        <Grid>
          <FormGroup>
            <FormControlLabel id="checkbox-form-vote" control={<Checkbox checked={canVote} id="checkbox-vote" onChange={(event) => { setCanVote(event.target.checked) }} />} label={`投票対象(〜${BOARDER}位)のみ`} />
            <FormControlLabel id="checkbox-form-hobby" control={<Checkbox checked={showHobby} id="checkbox-hobby" onChange={(event) => { setShowHobby(event.target.checked) }} />} label="ソート時に趣味欄を表示する" />
            <FormControlLabel id="checkbox-form-skill" control={<Checkbox checked={showSkill} id="checkbox-skill" onChange={(event) => { setShowSkill(event.target.checked) }} />} label="ソート時に特技欄を表示する" />
            <FormControlLabel id="checkbox-form-ranking" control={<Checkbox checked={showRanking} id="checkbox-ranking" onChange={(event) => { setShowRanking(event.target.checked) }} />} label="ソート時に順位変動を表示する" />
          </FormGroup>
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