import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Container = styled.div({});

const DrawingContainer = styled.div({
  padding: '2rem',
  maxWidth: '480px',
  margin: '0 auto',
});

const TextContainer = styled.div(({ theme }) => ({
  textAlign: 'center',
  color: theme.textLightColor,
}));

const PlaceHolder = ({
  drawing,
  text,
}: {
  drawing: ReactNode;
  text: ReactNode;
}) => {
  return (
    <Container>
      <DrawingContainer>{drawing}</DrawingContainer>
      <TextContainer>{text}</TextContainer>
    </Container>
  );
};

export default PlaceHolder;
