import styled from "@emotion/styled";
import { Link as ReactRouterLink } from "react-router-dom";

const Link = styled(ReactRouterLink)(({ theme }) => ({
  color: theme.primaryColor,
  textDecoration: "none",
  fontWeight: "600"
}));

export default Link;
