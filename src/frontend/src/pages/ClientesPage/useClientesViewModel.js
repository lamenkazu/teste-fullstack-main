import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../../api";

export const useClientesViewModel = () => {
	const qc = useQueryClient();

	// Estados locais
	const [filtro, setFiltro] = useState("");
	const [mensalista, setMensalista] = useState("all");
	// TODO: abandonar useState e passar a usar o react-hook-form para a insersão de um novo cliente.
	const [form, setForm] = useState({
		nome: "",
		telefone: "",
		endereco: "",
		mensalista: false,
		valorMensalidade: "",
	});
	const [modalAberta, setModalAberta] = useState(false);
	const [clienteEdicao, setClienteEdicao] = useState(null);
	const [erroEdicao, setErroEdicao] = useState("");

	// Query para buscar clientes
	const clientesQuery = useQuery({
		queryKey: ["clientes", filtro, mensalista],
		queryFn: () =>
			apiGet(
				`/api/clientes?pagina=1&tamanho=20&filtro=${encodeURIComponent(
					filtro,
				)}&mensalista=${mensalista}`,
			),
	});

	// Mutation para criar cliente
	const createMutation = useMutation({
		mutationFn: (data) => apiPost("/api/clientes", data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clientes"] });
			setForm({
				nome: "",
				telefone: "",
				endereco: "",
				mensalista: false,
				valorMensalidade: "",
			});
		},
		onError: (error) => {
			console.error("Erro ao criar cliente:", error);
			alert(`Erro ao criar cliente: ${error.message}`);
		},
	});

	// Mutation para atualizar cliente
	const atualizarMutation = useMutation({
		mutationFn: ({ id, data }) => apiPut(`/api/clientes/${id}`, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clientes"] });
			setModalAberta(false);
			setClienteEdicao(null);
			setErroEdicao("");
		},
		onError: (error) => {
			console.error("Erro ao atualizar cliente:", error);
			if (error.message.includes("Cliente já existe")) {
				setErroEdicao("Já existe um cliente com este nome e telefone.");
			} else {
				setErroEdicao(`Erro ao atualizar cliente: ${error.message}`);
			}
		},
	});

	// Mutation para remover cliente
	const removerMutation = useMutation({
		mutationFn: (id) => apiDelete(`/api/clientes/${id}`),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"] }),
		onError: (error) => {
			console.error("Erro ao remover cliente:", error);
			alert(`Erro ao remover cliente: ${error.message}`);
		},
	});

	// Funções para controlar o modal
	const abrirModalEdicao = (cliente) => {
		setClienteEdicao(cliente);
		setModalAberta(true);
		setErroEdicao("");
	};

	const fecharModal = () => {
		setModalAberta(false);
		setClienteEdicao(null);
		setErroEdicao("");
	};

	// Função para salvar edição com validação
	const salvarEdicao = (dados) => {
		// Validação de unicidade Nome + Telefone
		const clientesExistentes = clientesQuery.data?.itens || [];
		const clienteDuplicado = clientesExistentes.find(
			(c) =>
				c.id !== clienteEdicao.id &&
				c.nome.toLowerCase() === dados.nome.toLowerCase() &&
				c.telefone === dados.telefone,
		);

		if (clienteDuplicado) {
			setErroEdicao("Já existe outro cliente com este nome e telefone.");
			return;
		}

		atualizarMutation.mutate({ id: clienteEdicao.id, data: dados });
	};

	// Retorna todo o estado e funções que os componentes precisam
	return {
		// Estados
		filtro,
		setFiltro,
		mensalista,
		setMensalista,
		form,
		setForm,
		modalAberta,
		clienteEdicao,
		erroEdicao,

		// Query data
		clientesData: clientesQuery.data,
		isLoading: clientesQuery.isLoading,

		// Mutations
		createMutation,
		atualizarMutation,
		removerMutation,

		// Funções
		abrirModalEdicao,
		fecharModal,
		salvarEdicao,
	};
};
