import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, BOARDER } from './Constants';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { SearchParams } from "../hooks/useNPDatabase";
import useNPSearch from "../hooks/useNPSearch";

interface Props {
  onMemberUpdated?: (members: string[]) => void;
  onSortSettingsUpdated?: (setting: SortSetting) => void;
  initial_params: SearchParams,
  current_params: SearchParams
}

export interface SortSetting {
  show_hobby: boolean;
  show_skill: boolean;
  show_ranking: boolean;
}

export default function Home(props: Props) {
  const {members, setMBTIs, setBirthPlaces, setHeights, setYears, showHobby, setShowHobby, showRanking, setShowRanking, showSkill, setShowSkill, canVote, setCanVote} = useNPSearch(props.current_params);

  useEffect(() => {
    props.onMemberUpdated?.(members);
    // eslint-disable-next-line
  }, [members])

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
        <p>(最終更新:23/11/5 結果をツイートする際に上位11人をツイートする仕様に変更)</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="MBTI"
            id="mbti"
            items={props.initial_params.mbtis}
            default_selected={props.current_params.mbtis}
            sort={true}
            onSubmit={setMBTIs} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="出身地"
            id="birthplace"
            items={props.initial_params.birthplaces}
            default_selected={props.current_params.birthplaces}
            sort={false}
            onSubmit={setBirthPlaces} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="身長"
            id="height"
            items={props.initial_params.heights}
            default_selected={props.current_params.heights}
            sort={true}
            onSubmit={setHeights} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="生まれ年"
            id="birthyear"
            items={props.initial_params.birthyears}
            default_selected={props.current_params.birthyears}
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
            to="sort"
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