import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import npDB from "../modules/NPDatabase";
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";

interface Props {
  onSubmit: (members: string[]) => void;
}

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));
  

export default function SearchPage(props: Props) {
    const [mbtis, setMBTIs] = React.useState<string[]>(npDB.allMBTI);
    const [birthplaces, setBirthPlaces] = React.useState<string[]>(npDB.allBirthPlace);
    const [heights, setHeights] = React.useState<string[]>(npDB.allHeights);
    const [members, setMembers] = React.useState<string[]>([]);
    const classes = useStyles();
  
    const handleMBTIChange = (event: any) => {
        setMBTIs(event.target.value);
    };

    const handleBirthPlaceChange = (event: any) => {
        setBirthPlaces(event.target.value);
    };

    const handleHeightsChange = (event: any) => {
        setHeights(event.target.value);
    };

    useEffect(() => {
        setMembers(npDB.search(mbtis, birthplaces, heights));
    },[mbtis, birthplaces, heights])

    useEffect(() => {
        props.onSubmit(members)
    },[members])

    return (
        <div>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="mutiple-mbti-label">MBTI</InputLabel>
                    <Select
                    id="mbti-select"
                    value={mbtis}
                    multiple
                    renderValue={(selected: any) => selected.join(', ')}
                    onChange={handleMBTIChange}
                    >
                        {npDB.allMBTI.map((val) => {
                            return (
                            <MenuItem key={val} value={val}>
                                <Checkbox checked={mbtis.indexOf(val) > -1} />
                                <ListItemText primary={val} />
                            </MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Grid>

            <Grid container item xs={12} justifyContent="center" spacing={0}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="mutiple-birthplace-label">出身地</InputLabel>
                    <Select
                    id="birthplace-select"
                    value={birthplaces}
                    multiple
                    renderValue={(selected: any) => selected.join(', ')}
                    onChange={handleBirthPlaceChange}
                    >   
                        {npDB.allBirthPlace.map((val) => {
                            return (
                            <MenuItem key={val} value={val}>
                                <Checkbox checked={birthplaces.indexOf(val) > -1} />
                                <ListItemText primary={val} />
                            </MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Grid>

            <Grid container item xs={12} justifyContent="center" spacing={0}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="mutiple-mbti-label">身長</InputLabel>
                    <Select
                    id="height-select"
                    value={heights}
                    multiple
                    renderValue={(selected: any) => selected.join(', ')}
                    onChange={handleHeightsChange}
                    >   
                        {npDB.allHeights.map((val) => {
                            return (
                            <MenuItem key={val} value={val}>
                                <Checkbox checked={heights.indexOf(val) > -1} />
                                <ListItemText primary={val} />
                            </MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid container item xs={12} justifyContent="center" spacing={0}>
                該当者 {members.length}名
            </Grid>
            <Grid container item xs={12} justifyContent="center" spacing={0}>
                <Button 
                to="np"
                component={Link}
                disabled={members.length == 0}
                color="secondary"
                >
                    ソート開始
                </Button>
            </Grid>
        </div>
    );
}