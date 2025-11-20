import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../../api";

export const useVeiculosViewModel = () => {
	const qc = useQueryClient();

	// Estados locais
	const [clienteId, setClienteId] = useState("");
	const [form, setForm] = useState({
		placa: "",
		modelo: "",
		ano: "",
		clienteId: "",
	});
	const [modalAberta, setModalAberta] = useState(false);
	const [veiculoEdicao, setVeiculoEdicao] = useState(null);
	const [erroEdicao, setErroEdicao] = useState("");

	// Query para buscar clientes
	const clientesQuery = useQuery({
		queryKey: ["clientes-mini"],
		queryFn: () => apiGet("/api/clientes?pagina=1&tamanho=100"),
	});

	// Query para buscar veículos
	const veiculosQuery = useQuery({
		queryKey: ["veiculos", clienteId],
		queryFn: () =>
			apiGet(`/api/veiculos${clienteId ? `?clienteId=${clienteId}` : ""}`),
		enabled: !!clienteId,
	});

	// Effect para definir o primeiro cliente como padrão
	useEffect(() => {
		if (clientesQuery.data?.itens?.length && !clienteId) {
			const primeiroCliente = clientesQuery.data.itens[0];
			setClienteId(primeiroCliente.id);
			setForm((f) => ({
				...f,
				clienteId: primeiroCliente.id,
			}));
		}
	}, [clientesQuery.data, clienteId]);

	// Mutation para criar veículo
	const createMutation = useMutation({
		mutationFn: (data) => apiPost("/api/veiculos", data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["veiculos"] });
			setForm({
				placa: "",
				modelo: "",
				ano: "",
				clienteId: clienteId,
			});
		},
		onError: (error) => {
			console.error("Erro ao criar veículo:", error);
			alert(`Erro ao criar veículo: ${error.message}`);
		},
	});

	// Mutation para atualizar veículo
	const atualizarMutation = useMutation({
		mutationFn: ({ id, data }) => apiPut(`/api/veiculos/${id}`, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["veiculos"] });
			setModalAberta(false);
			setVeiculoEdicao(null);
			setErroEdicao("");
		},
		onError: (error) => {
			console.error("Erro ao atualizar veículo:", error);
			setErroEdicao(`Erro ao atualizar veículo: ${error.message}`);
		},
	});

	// Mutation para remover veículo
	const removerMutation = useMutation({
		mutationFn: (id) => apiDelete(`/api/veiculos/${id}`),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["veiculos"] }),
		onError: (error) => {
			console.error("Erro ao remover veículo:", error);
			alert(`Erro ao remover veículo: ${error.message}`);
		},
	});

	// Função para alterar cliente e atualizar form
	const alterarCliente = (novoClienteId) => {
		setClienteId(novoClienteId);
		setForm((f) => ({
			...f,
			clienteId: novoClienteId,
		}));
	};

	// Funções para controlar o modal
	const abrirModalEdicao = (veiculo) => {
		setVeiculoEdicao(veiculo);
		setModalAberta(true);
		setErroEdicao("");
	};

	const fecharModal = () => {
		setModalAberta(false);
		setVeiculoEdicao(null);
		setErroEdicao("");
	};

	// Função para salvar edição
	const salvarEdicao = (dados) => {
		atualizarMutation.mutate({
			id: veiculoEdicao.id,
			data: {
				...dados,
				clienteId: veiculoEdicao.clienteId,
			},
		});
	};

	// Função para criar veículo
	const criarVeiculo = () => {
		createMutation.mutate({
			placa: form.placa,
			modelo: form.modelo,
			ano: form.ano ? Number(form.ano) : null,
			clienteId: form.clienteId || clienteId,
		});
	};

	// Retorna todo o estado e funções que os componentes precisam
	return {
		// Estados
		clienteId,
		form,
		setForm,
		modalAberta,
		veiculoEdicao,
		erroEdicao,

		// Query data
		clientesData: clientesQuery.data,
		veiculosData: veiculosQuery.data,
		isLoading: veiculosQuery.isLoading,

		// Mutations
		createMutation,
		atualizarMutation,
		removerMutation,

		// Funções
		alterarCliente,
		abrirModalEdicao,
		fecharModal,
		salvarEdicao,
		criarVeiculo,
	};
};
