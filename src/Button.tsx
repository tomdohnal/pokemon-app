import styled from "@emotion/styled";

const Button = styled.button<{
  variant?: "solid" | "outline";
  size?: "md" | "sm";
}>(({ theme, variant = "solid", size = "lg" }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: size === "lg" ? "48px" : "40px",
  padding: "0 1rem",
  fontSize: size === "lg" ? "1.25rem" : "1rem",
  fontWeight: "600",
  color: variant === "solid" ? " #fff" : theme.primaryColor,
  backgroundColor: variant === "solid" ? theme.primaryColor : "#fff",
  border: variant === "solid" ? "none" : `2px ${theme.primaryColor} solid`,
  cursor: "pointer",
  borderRadius: "4px"
}));

export default Button;
