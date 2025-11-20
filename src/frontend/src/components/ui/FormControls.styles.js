import styled, { css } from "styled-components";

const baseFieldStyles = css`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => (props.$error ? "red" : "#ccc")};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "red" : "#007bff")};
    box-shadow: 0 0 0 2px
      ${(props) =>
				props.$error ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 123, 255, 0.1)"};
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
    color: #94a3b8;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const FormContainer = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

export const Input = styled.input`
  ${baseFieldStyles}
`;

export const Textarea = styled.textarea`
  ${baseFieldStyles}
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
`;

export const Select = styled.select`
  ${baseFieldStyles}
  background-color: #fff;
`;

export const CheckboxContainer = styled.label`
  display: flex;
  width: 100%;
  align-items: flex-end;
  gap: 8px;
  cursor: pointer;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  transform: scale(1.2);
  width: fit-content;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-weight: bold;
  color: #333;
  cursor: pointer;
`;

export const HelpText = styled.small`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 2px;
  display: block;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;
