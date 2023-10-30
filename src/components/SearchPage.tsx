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
    const [mbtis, setMBTIs] = React.useState<string[]>(npDB.allMBTI);
    const [birthplaces, setBirthPlaces] = React.useState<string[]>(npDB.allBirthPlace);
    const [heights, setHeights] = React.useState<string[]>(npDB.allHeights);
    const [members, setMembers] = React.useState<string[]>([]);

    useEffect(() => {
      setMembers(npDB.search(mbtis, birthplaces, heights));
    },[mbtis, birthplaces, heights])

    useEffect(() => {
      props.onUpdated(members)
      // eslint-disable-next-line
    },[members])

    return (
        <Grid container item xs={12} justifyContent="center" spacing={1}>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="MBTI" items={npDB.allMBTI} onSubmit={setMBTIs}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="出身地" items={npDB.allBirthPlace} onSubmit={setBirthPlaces}></SearchSelect>
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
              <SearchSelect title="身長" items={npDB.allHeights} onSubmit={setHeights}></SearchSelect>
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