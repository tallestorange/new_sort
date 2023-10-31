import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import npDB from "../modules/NPDatabase";
import Grid from "@material-ui/core/Grid";
import SearchSelect from "./SearchSelect";

interface Props {
  onUpdated: (members: string[]) => void;
}

export default function SearchPage(props: Props) {
    const all_mbtis = npDB.allMBTI;
    const all_birthplaces = npDB.allBirthPlace;
    const all_heights = npDB.allHeights;
    const all_birthyears = npDB.allYears;

    const [mbtis, setMBTIs] = React.useState<string[]>(all_mbtis);
    const [birthplaces, setBirthPlaces] = React.useState<string[]>(all_birthplaces);
    const [heights, setHeights] = React.useState<string[]>(all_heights);
    const [years, setYears] = React.useState<string[]>(all_birthyears);
    const [members, setMembers] = React.useState<string[]>([]);

    useEffect(() => {
      setMembers(npDB.search(mbtis, birthplaces, heights, years));
    },[mbtis, birthplaces, heights, years])

    useEffect(() => {
      console.log(members)
      props.onUpdated(members)
      // eslint-disable-next-line
    },[members])

    return (
        <Grid container item xs={12} justifyContent="center" spacing={1}>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="MBTI" items={all_mbtis} onSubmit={setMBTIs}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="出身地" items={all_birthplaces} onSubmit={setBirthPlaces}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="身長" items={all_heights} onSubmit={setHeights}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="生まれ年" items={all_birthyears} onSubmit={setYears}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              該当者 {members.length}名
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