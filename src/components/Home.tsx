import React from "react";
import Grid from "@material-ui/core/Grid";
import SearchPage from "./SearchPage";
import "../App.css";

interface State {
  target_members: string[];
}

interface Props {
  onSubmit: (members: string[]) => void;
}

const TITLE = "日プソート";

export default class Home extends React.Component<Props, State> {
    render() {
      return (
        <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={1}>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <h1>{TITLE}</h1>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <p>(最終更新:23/10/30 絞り込み機能追加)</p>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <SearchPage onUpdated={this.props.onSubmit}></SearchPage>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています</p>
          </Grid>
        </Grid>
      );
    }
  }