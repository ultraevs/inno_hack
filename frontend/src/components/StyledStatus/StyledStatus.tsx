import styled from "styled-components";

interface StyledStatusProps {
  readonly $bgColor: string;
  readonly $textColor: string;
  readonly $hoverBgColor: string;
  readonly $hoverTextColor: string;
  readonly className?: string;
}

const StyledStatus = styled.li<StyledStatusProps>`
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  transition: all 0.3s ease-in-out;

  & > div {
    background: ${(props) => props.$textColor};
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    background: ${(props) => props.$hoverBgColor};
    color: ${(props) => props.$hoverTextColor};

    & > div {
      background: ${(props) => props.$hoverTextColor};
    }
  }
`;

export { StyledStatus };