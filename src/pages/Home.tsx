import Grid from "@mui/material/Grid";
import "../App.css";
import { TITLE, LATEST_CHANGE_LOG } from '../modules/Constants';
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

interface Props {
}

export default function Home(props: Props) {
  useEffect(() => {
    document.title = TITLE;
  }, []);

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>{LATEST_CHANGE_LOG}</p>
      </Grid> 
      
      <Grid container item xs={12} justifyContent="center" sx={{ mb: 2, mt: 2 }} spacing={1} >
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <Button component={Link} to="search_members" style={{ background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', color: 'white', fontWeight: 'bold', height: 32 }}>ハロプロメンバーソート</Button>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <Button component={Link} to="search_songs" style={{ background: 'linear-gradient(45deg, #11d386 30%, #11d3bb 90%)', color: 'white', fontWeight: 'bold', height: 32 }}>ハロプロ楽曲ソート</Button>
        </Grid>
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}