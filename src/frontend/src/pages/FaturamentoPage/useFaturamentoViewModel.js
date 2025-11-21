import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet, apiPost } from "../../api";

const mesAtual = () => {
	const hoje = new Date();
	const mes = String(hoje.getMonth() + 1).padStart(2, "0");
	return `${hoje.getFullYear()}-${mes}`;
};

export const useFaturamentoViewModel = () => {
	const qc = useQueryClient();
	const [competencia, setCompetencia] = useState(mesAtual);

	const faturasQuery = useQuery({
		queryKey: ["faturas", competencia],
		queryFn: () => apiGet(`/api/faturas?competencia=${competencia}`),
	});

	const gerarFaturasMutation = useMutation({
		mutationFn: (data) => apiPost("/api/faturas/gerar", data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["faturas"] });
		},
		onError: (error) => {
			console.error("Erro ao gerar faturas:", error);
			alert(`Erro ao gerar faturas: ${error.message}`);
		},
	});

	const gerarFaturas = async () => {
		gerarFaturasMutation.mutate({ competencia });
	};

	const formatarValor = (valor) => {
		return new Intl.NumberFormat("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(Number(valor ?? 0));
	};

	return {
		competencia,
		setCompetencia,
		faturasData: faturasQuery.data,
		isLoading: faturasQuery.isLoading,
		gerarFaturasMutation,
		gerarFaturas,
		formatarValor,
	};
};
