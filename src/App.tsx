import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import {TITLE} from './components/Constants'

import "./App.css";

import Layout from "./components/Layout";
import SortPage from "./components/SortPage";

interface Props { }
interface State {
  target_members: string[];
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      target_members: [],
    };
  }

  render() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
          <Layout title={TITLE}>
          <Routes>
            <Route path="/" element={<Home onSubmit={(val) => {this.setState({target_members: val})}}></Home>} />
            <Route path="/np" element={<SortPage members={this.state.target_members} sortName={TITLE} />} />
          </Routes>
          </Layout>
        </Router>
    );
  }
}