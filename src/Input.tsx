import styled from "@emotion/styled";

const Input = styled.input(({ theme }) => ({
  height: "48px",
  fontSize: "1.5rem",
  borderRadius: "4px",
  border: "2px solid",
  padding: ".5rem 1rem",
  borderColor: theme.lightGrey,
  ":focus": {
    borderColor: theme.primaryColor,
    outline: `2px ${theme.primaryColor} solid`
  }
}));

export default Input;
