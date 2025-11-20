import styled from "styled-components";
import { Input } from "../../../../components/ui";

export const CustomGrid = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: 3fr 1fr;

  .second-row {
    grid-column: 1 / -1;
    display: grid;
    gap: 15px;
    grid-template-columns: 3fr 1fr;
  }

  .third-row {
    grid-column: 1 / -1;
    display: grid;
    gap: 15px;
    grid-template-columns: 3fr 0.5fr;
    align-items: end;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .second-row,
    .third-row {
      grid-template-columns: 1fr;
    }
  }
`;

export const ValorMensalidadeInput = styled(Input)`
  &:disabled {
    background-color: black !important;
    color: white;
    text-decoration: line-through;
  }
`;
