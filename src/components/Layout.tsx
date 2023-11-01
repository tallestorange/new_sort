import React from "react";
import Header from "./Header";
import { Box, Container } from "@material-ui/core/";

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  return (
    <Box>
      <Header>{props.title}</Header>
      <Container><div>{props.children}</div></Container>
    </Box>
  );
}