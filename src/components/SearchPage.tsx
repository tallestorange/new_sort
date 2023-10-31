import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import npDB from "../modules/NPDatabase";
import Grid from "@material-ui/core/Grid";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';

interface Props {
  onUpdated: (members: string[]) => void;
  mbtis_stored: string[];
  all_birthplaces_stored: string[];
  all_heights_stored: string[];
  all_birthyears_stored: string[];
}

export default function SearchPage(props: Props) {
    const all_mbtis = npDB.allMBTI;
    const all_birthplaces = npDB.allBirthPlace;
    const all_heights = npDB.allHeights;
    const all_birthyears = npDB.allYears;

    const [mbtis, setMBTIs] = useState<string[]>(props.mbtis_stored);
    const [birthplaces, setBirthPlaces] = useState<string[]>(props.all_birthplaces_stored);
    const [heights, setHeights] = useState<string[]>(props.all_heights_stored);
    const [years, setYears] = useState<string[]>(props.all_birthyears_stored);
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
        <Grid container item xs={12} justifyContent="center" spacing={1}>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect 
              title="MBTI" 
              items={all_mbtis} 
              default_selected={props.mbtis_stored}
              sort={true}
              onSubmit={setMBTIs}/>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect 
              title="出身地" 
              items={all_birthplaces} 
              default_selected={props.all_birthplaces_stored} 
              sort={false}
              onSubmit={setBirthPlaces}/>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect 
              title="身長" 
              items={all_heights} 
              default_selected={props.all_heights_stored}
              sort={true}
              onSubmit={setHeights}/>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect 
              title="生まれ年" 
              items={all_birthyears}
              default_selected={props.all_birthyears_stored}
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
    );
}