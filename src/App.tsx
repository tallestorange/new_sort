import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';

import "./App.css";

import Layout from "./components/Layout";
import SortPage from "./components/SortPage";

interface Props { }
interface State {
  target_members: string[];
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