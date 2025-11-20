import styled from "styled-components";

export const CardContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 16px;
	margin-bottom: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const Card = styled.div`
	background: ${(props) => {
		switch (props.$variant) {
			case "success":
				return "#b8ffd3ff";
			case "info":
				return "#cbeaf4";
			case "warning":
				return "#fceceaff";
			case "danger":
				return "#ffd0c9";
			default:
				return "#ffd0c9";
		}
	}};
	border-radius: 12px;
	padding: 20px;
	text-align: center;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	border: 1px solid
		${(props) => {
			switch (props.$variant) {
				case "success":
					return "#d4edda";
				case "info":
					return "#b3d9ff";
				case "warning":
					return "#ffeaa7";
				case "danger":
					return "#f8d7da";
				default:
					return "#e9ecef";
			}
		}};
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}
`;

export const CardNumber = styled.div`
	font-size: 2.5rem;
	font-weight: 700;
	color: black;
	margin-bottom: 8px;
	line-height: 1;
`;

// Ícone que fica ao lado do label
export const CardIcon = styled.img`
	width: 32px;
	height: 32px;
	object-fit: contain;
`;

// Linha de baixo: ícone + texto
export const CardLabel = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 4px;

	font-size: 0.95rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: black;

	span {
		line-height: 1.2;
	}
`;

export const ErrosContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 12px;
	margin-top: 16px;
	margin-bottom: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const ErroCard = styled(Card)`
	padding: 16px;

	${CardNumber} {
		font-size: 2rem;
	}
`;

export const DetalhesContainer = styled.div`
	margin-top: 24px;
`;

export const DetalhesTitle = styled.h4`
	color: #495057;
	margin-bottom: 16px;
	font-size: 1.1rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const ErroItem = styled.div`
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-left: 4px solid #dc3545;
	border-radius: 6px;
	padding: 12px 16px;
	margin-bottom: 8px;
	font-family: "Poppins", monospace;
	font-size: 0.9rem;
	color: #495057;
`;

export const ContainerVazio = styled.div`
	text-align: center;
	color: #6c757d;
	font-style: italic;
	padding: 40px 20px;
	background: #f8f9fa;
	border-radius: 12px;
	border: 2px dashed #dee2e6;
`;

export const DetalhesColunasContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
	margin-top: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const ColunaDetalhes = styled.div`
	background: #f8f9fa;
	border-radius: 12px;
	padding: 20px;
	border: 1px solid #dee2e6;
`;

export const ColunaVazia = styled.div`
	text-align: center;
	color: #6c757d;
	font-style: italic;
	padding: 20px;
	background: #ffffff;
	border-radius: 8px;
	border: 1px dashed #dee2e6;
`;

export const TextoLinha = styled.span`
	text-decoration: underline;
	text-decoration-color: #007bff;
	text-decoration-thickness: 2px;
	font-weight: 600;
	color: #007bff;
`;

export const TextoErro = styled.span`
	font-weight: 700;
	color: #dc3545;

`;

export const TextoDados = styled.span`
	color: #495057;
	font-family: "Poppins", monospace;
`;

export const ContainerErroItem = styled.div`
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-left: 4px solid #dc3545;
	border-radius: 6px;
	padding: 12px 16px;
	margin-bottom: 8px;
	font-family: "Poppins", monospace;
	font-size: 0.9rem;
	color: #495057;
	line-height: 1.4;
`;
