import styled from "styled-components";

export const ButtonContainer = styled.button`
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid #c7cbd1;
  background:
    linear-gradient(180deg, #f5f7fa 0%, #e9edf2 100%),
    radial-gradient(
      100% 200% at 50% 0%,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  color: #2b3240;
  cursor: pointer;

  ${(props) => {
		switch (props.$variant) {
			case "primary":
				return `
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 1px 2px rgba(0, 0, 0, 0.05);

          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `;

			case "ghost":
				return `
          background-color: transparent;
          color: #475569;

          &:hover:not(:disabled) {
            background-color: #007bff;
          }
        `;

			case "danger":
				return `
          // background-color: #dc3545;
          color: white;

          &:hover:not(:disabled) {
            background-color: #c82333;
          }
        `;

			case "cancel":
				return `
          border: none;
          background: #c82333;
          color: white;

          &:hover:not(:disabled) {
            background: #dc3545;
          }
        `;

			default:
				return `
          background-color: #007bff;
          color: white;

          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `;
		}
	}}

  &.btn-ghost {
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;

    &:hover:not(:disabled) {
      background-color: #007bff;
      color: white;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
