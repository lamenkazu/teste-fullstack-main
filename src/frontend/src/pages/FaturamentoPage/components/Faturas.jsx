import { useMemo, useState } from "react";
import { apiGet } from "../../../api";
import { Button } from "../../../components/Button";
import {
	LoadingText,
	Section,
	Table,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui";

const formatCompetencia = (competencia) => {
	if (!competencia) return "-";
	const [ano, mes] = competencia.split("-");
	return `${mes}/${ano}`;
};

export const Faturas = ({ faturasData, isLoading, formatarValor }) => {
	const [placas, setPlacas] = useState({});
	const [showPlacas, setShowPlacas] = useState({});

	const toggleShowPlacas = async (faturaId) => {
		if (!showPlacas[faturaId]) {
			const placasData = await apiGet(`/api/faturas/${faturaId}/placas`);
			setPlacas((prev) => ({ ...prev, [faturaId]: placasData }));
		}
		setShowPlacas((prev) => ({
			...prev,
			[faturaId]: !prev[faturaId],
		}));
	};

	const faturasOrdenadas = useMemo(() => faturasData ?? [], [faturasData]);

	if (isLoading) {
		return (
			<Section>
				<LoadingText>Carregando...</LoadingText>
			</Section>
		);
	}

	return (
		<Section>
			<Table>
				<TableHead>
					<TableRow>
						<TableHeader>Cliente</TableHeader>
						<TableHeader>Competencia</TableHeader>
						<TableHeader>Valor fatura</TableHeader>
						<TableHeader>Placas</TableHeader>
					</TableRow>
				</TableHead>
				<tbody>
					{faturasOrdenadas.map((f) => {
						return (
							<TableRow key={f.id}>
								<TableCell>
									<div style={{ fontWeight: 700 }}>{f.clienteNome || "-"}</div>
									<div style={{ fontSize: "12px", color: "#777" }}>
										{f.clienteId}
									</div>
								</TableCell>
								<TableCell>
									<span
										style={{
											padding: "4px 8px",
											borderRadius: "10px",
											background: "#eef3ff",
											color: "#1b3a8a",
											fontWeight: 600,
											fontSize: "12px",
										}}
									>
										{formatCompetencia(f.competencia)}
									</span>
								</TableCell>
								<TableCell>
									<div style={{ fontWeight: 700, fontSize: "16px" }}>
										R$ {formatarValor(f.valor)}
									</div>
									<div
										style={{ fontSize: "11px", color: "#5a5a5a", marginTop: 4 }}
									>
										{f.qtdVeiculos} veículo(s) faturado(s)
									</div>
								</TableCell>

								<TableCell>
									<Button
										variant="ghost"
										onClick={() => toggleShowPlacas(f.id)}
										style={{ padding: "4px 8px" }}
									>
										{showPlacas[f.id] ? "ocultar" : "detalhar"}
									</Button>
									{showPlacas[f.id] && placas[f.id] && (
										<div
											style={{
												marginTop: 6,
												fontSize: "13px",
												color: "#444",
												lineHeight: 1.4,
											}}
										>
											{placas[f.id].length
												? placas[f.id].join(", ")
												: "Sem placas"}
										</div>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</tbody>
			</Table>
		</Section>
	);
};
