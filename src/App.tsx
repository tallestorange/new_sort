import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import SearchPage from "./components/SearchPage";

import "./App.css";

import Layout from "./components/Layout";
import SortPage from "./components/SortPage";

interface Props { }
interface State {
  target_members: string[];
}

interface Props3 {
  onSubmit: (members: string[]) => void;
}

const TITLE = "日プソート";

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      target_members: [],
    };
  }

  render() {
    return (
      <Layout title={TITLE}>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home onSubmit={(val) => {this.setState({target_members: val})}}></Home>} />
            <Route path="/np" element={<div><SortPage members={this.state.target_members} sortName="日プソート" /></div>} />
          </Routes>
        </Router>
      </Layout>
    );
  }
}

class Home extends React.Component<Props3, State> {
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
          <SearchPage onSubmit={this.props.onSubmit}></SearchPage>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています。</p>
        </Grid>
      </Grid>
    );
  }
}