import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TableHead = styled.thead`
  background-color: #007bff;
  color: white;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e3f2fd;
  }
`;

export const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
`;

export const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
`;
