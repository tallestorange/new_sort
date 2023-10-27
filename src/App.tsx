import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import "./App.css";

import Layout from "./components/Layout";
import SortPage from "./components/SortPage";
import npDB from "./modules/NPDatabase";

interface Props { }
interface State {
  result: boolean;
  round: number;
}

const TITLE = "日プソート";

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <Layout title={TITLE}>
        <Router basename={process.env.PUBLIC_URL}>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route path="/np" component={NPAll} />
        </Router>
      </Layout>
    );
  }
}

class Home extends React.Component<Props, State> {
  render() {
    function helpAlert() {
      alert("選択を繰り返すことで自分だけのランキングを作ることができます。\n今まで気づかなかった「好き」を再発見するためにご利用ください。\nソートの結果はあなたにとってのランキングであり、メンバーの優劣を意味しません。")
    }
    return (
      <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <h1>{TITLE}</h1>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <p>(最終更新:23/10/27 初リリース)</p>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <p><a href="./" onClick={helpAlert}>🔰日プソートとは？🔰</a><br></br><br></br></p>
        </Grid>
        <Grid container item xs={12} justifyContent="center"><Button href="np" style={{ background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', color: 'white', fontWeight: 'bold', height: 32 }}>全員ソート</Button></Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています。</p>
        </Grid>
      </Grid>
    );
  }
}

class NPAll extends React.Component<Props, State> {
  render() {
    return <div><SortPage members={npDB.allStars} sortName="日プソート" /></div>;
  }
}