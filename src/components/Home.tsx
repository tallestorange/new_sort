import React from "react";
import Grid from "@material-ui/core/Grid";
import SearchPage from "./SearchPage";
import "../App.css";
import {TITLE} from './Constants';

interface State {
}

interface Props {
  onUpdated: (members: string[]) => void;
  mbtis_stored: string[];
  all_birthplaces_stored: string[];
  all_heights_stored: string[];
  all_birthyears_stored: string[];
}

export default class Home extends React.Component<Props, State> {
    render() {
      return (
        <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={3}>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <h1>{TITLE}</h1>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <p>(最終更新:23/10/31 各種処理の最適化)</p>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <SearchPage
            onUpdated={this.props.onUpdated}
            mbtis_stored={this.props.mbtis_stored}
            all_birthplaces_stored={this.props.all_birthplaces_stored}
            all_heights_stored={this.props.all_heights_stored}
            all_birthyears_stored={this.props.all_birthyears_stored} />
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています</p>
          </Grid>
        </Grid>
      );
    }
  }