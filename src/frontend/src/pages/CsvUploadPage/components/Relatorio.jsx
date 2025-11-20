import AdicionadoIcon from "../../../assets/Adicionado.svg";
import DuplicadoIcon from "../../../assets/Duplicado.svg";
import ErroIcon from "../../../assets/Erro.svg";
import InvalidoIcon from "../../../assets/Invalido.svg";
import ProcessadoIcon from "../../../assets/Processado.svg";
import { LoadingText, Section } from "../../../components/ui";
import {
	Card,
	CardContainer,
	CardIcon,
	CardLabel,
	CardNumber,
	ColunaDetalhes,
	ContainerErroItem,
	ContainerVazio,
	DetalhesColunasContainer,
	ErroCard,
	ErrosContainer,
	TextoDados,
	TextoErro,
	TextoLinha,
} from "./styles/CardInformativo.styles";

export const Relatorio = ({ log, isUploading }) => {
	if (isUploading) {
		return (
			<Section>
				<LoadingText>Processando arquivo...</LoadingText>
			</Section>
		);
	}

	if (!log) {
		return <ContainerVazio>Aguardando upload...</ContainerVazio>;
	}

	// Analisar erros para contar tipos específicos
	const analisarErros = (erros = []) => {
		const placasDuplicadas = erros.filter((erro) =>
			erro.includes("Placa duplicada"),
		);
		const placasInvalidas = erros.filter((erro) =>
			erro.includes("Placa inválida"),
		);

		return { placasDuplicadas, placasInvalidas };
	};

	const { placasDuplicadas, placasInvalidas } = analisarErros(log.erros);

	return (
		<>
			{/* Cards principais */}
			<CardContainer>
				<Card $variant="info">
					<CardNumber $variant="info">{log.processados || 0}</CardNumber>

					<CardLabel $variant="info">
						<CardIcon src={ProcessadoIcon} alt="Ícone de itens processados" />
						<span>Itens Processados</span>
					</CardLabel>
				</Card>

				<Card $variant="success">
					<CardNumber $variant="success">{log.inseridos || 0}</CardNumber>

					<CardLabel $variant="success">
						<CardIcon src={AdicionadoIcon} alt="Ícone de itens inseridos" />
						<span>Veículos Inseridos</span>
					</CardLabel>
				</Card>

				<Card $variant="danger">
					<CardNumber $variant="danger">{log.erros?.length || 0}</CardNumber>

					<CardLabel $variant="danger">
						<CardIcon src={ErroIcon} alt="Ícone de erros totais" />
						<span>Total de Erros</span>
					</CardLabel>
				</Card>
			</CardContainer>

			{/* Cards de tipos de erro */}
			<ErrosContainer>
				<ErroCard $variant="warning">
					<CardNumber $variant="warning">{placasDuplicadas.length}</CardNumber>

					<CardLabel $variant="warning">
						<CardIcon src={DuplicadoIcon} alt="Ícone de placa duplicada" />
						<span>Erros por Placas Duplicadas</span>
					</CardLabel>
				</ErroCard>

				<ErroCard $variant="warning">
					<CardNumber $variant="warning">{placasInvalidas.length}</CardNumber>

					<CardLabel $variant="warning">
						<CardIcon src={InvalidoIcon} alt="Ícone de placa inválida" />
						<span>Erros por Placas Inválidas</span>
					</CardLabel>
				</ErroCard>
			</ErrosContainer>

			{/* Relatório detalhado em duas colunas */}
			{(placasDuplicadas.length > 0 || placasInvalidas.length > 0) && (
				<DetalhesColunasContainer>
					{/* Coluna Esquerda - Placas Duplicadas */}
					<ColunaDetalhes>
						{placasDuplicadas.length > 0 ? (
							placasDuplicadas.map((erro, index) => (
								<ContainerErroItem
									key={`duplicada-${erro.substring(0, 20)}-${index}`}
								>
									<TextoEstilizado texto={erro} />
								</ContainerErroItem>
							))
						) : (
							<ContainerVazio>Nenhum erro de placa duplicada</ContainerVazio>
						)}
					</ColunaDetalhes>

					{/* Coluna Direita - Placas Inválidas */}
					<ColunaDetalhes>
						{placasInvalidas.length > 0 ? (
							placasInvalidas.map((erro, index) => (
								<ContainerErroItem
									key={`invalida-${erro.substring(0, 20)}-${index}`}
								>
									<TextoEstilizado texto={erro} />
								</ContainerErroItem>
							))
						) : (
							<ContainerVazio>Nenhum erro de placa inválida</ContainerVazio>
						)}
					</ColunaDetalhes>
				</DetalhesColunasContainer>
			)}
		</>
	);
};

// Função para estilizar partes específicas do texto do erro
const estilizarTextoErro = (texto) => {
	const partes = [];

	let i = 0;
	while (i < texto.length) {
		// Verificar se encontramos "Linha X:"
		if (texto.substr(i, 6) === "Linha ") {
			let j = i + 6;
			while (j < texto.length && /\d/.test(texto[j])) {
				j++;
			}
			if (texto.substr(j, 1) === ":") {
				partes.push({
					texto: texto.substring(i, j + 1),
					tipo: "linha",
				});
				i = j + 1;
				continue;
			}
		}

		// Verificar se encontramos "Placa duplicada" ou "Placa inválida"
		if (texto.substr(i, 15) === "Placa duplicada") {
			partes.push({
				texto: "Placa duplicada",
				tipo: "erro",
				dados: { tipo: "duplicada" },
			});
			i += 15;
			continue;
		}

		if (texto.substr(i, 14) === "Placa inválida") {
			partes.push({
				texto: "Placa inválida",
				tipo: "erro",
				dados: { tipo: "invalida" },
			});
			i += 14;
			continue;
		}

		// Adicionar caractere normal
		partes.push({
			texto: texto[i],
			tipo: "normal",
		});
		i++;
	}

	return partes;
};

// Componente para renderizar texto estilizado
const TextoEstilizado = ({ texto }) => {
	const partes = estilizarTextoErro(texto);

	return (
		<>
			{partes.map((parte, index) => {
				const key = `parte-${index}-${parte.texto.substring(0, 10)}`;

				if (parte.tipo === "linha") {
					return <TextoLinha key={key}>{parte.texto}</TextoLinha>;
				} else if (parte.tipo === "erro") {
					return (
						<TextoErro key={key} $tipo={parte.dados.tipo}>
							{parte.texto}
						</TextoErro>
					);
				} else {
					return <TextoDados key={key}>{parte.texto}</TextoDados>;
				}
			})}
		</>
	);
};
