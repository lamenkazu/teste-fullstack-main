import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const PageTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

export const SectionTitle = styled.h3`
  color: #333;
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 18px;
`;

export const Section = styled.section`
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

export const Grid = styled.div`
  display: grid;
  gap: 15px;

  &.grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  &.grid-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &.grid-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  &.grid-5 {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    &.grid-2,
    &.grid-3,
    &.grid-4,
    &.grid-5 {
      grid-template-columns: 1fr;
    }
  }
`;
