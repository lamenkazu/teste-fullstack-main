import { Modal } from "../../components/Modal";
import {
	ErrorAlert,
	PageContainer,
	PageTitle,
	SectionTitle,
} from "../../components/ui";
import { BuscaClientes } from "./components/BuscaClientes";
import { FormularioEdicaoCliente } from "./components/FormularioEdicaoCliente";
import { ListaClientes } from "./components/ListaClientes";
import { NovoCliente } from "./components/NovoCliente";
import { useClientesViewModel } from "./useClientesViewModel";

export const ClientesPage = () => {
	const vm = useClientesViewModel();

	return (
		<PageContainer>
			<PageTitle>Clientes</PageTitle>

			<BuscaClientes
				filtro={vm.filtro}
				setFiltro={vm.setFiltro}
				mensalista={vm.mensalista}
				setMensalista={vm.setMensalista}
			/>

			<SectionTitle>Novo cliente</SectionTitle>
			<NovoCliente
				form={vm.form}
				setForm={vm.setForm}
				createMutation={vm.createMutation}
			/>

			<SectionTitle style={{ marginTop: "16px" }}>Lista</SectionTitle>
			<ListaClientes
				clientesData={vm.clientesData}
				isLoading={vm.isLoading}
				abrirModalEdicao={vm.abrirModalEdicao}
				removerMutation={vm.removerMutation}
			/>

			{/* Modal de Edição */}
			<Modal
				isOpen={vm.modalAberta}
				onClose={vm.fecharModal}
				titulo="Editar Cliente"
			>
				{vm.clienteEdicao && (
					<div>
						{vm.erroEdicao && <ErrorAlert>{vm.erroEdicao}</ErrorAlert>}
						<FormularioEdicaoCliente
							cliente={vm.clienteEdicao}
							onSubmit={vm.salvarEdicao}
							onCancel={vm.fecharModal}
							isLoading={vm.atualizarMutation.isLoading}
						/>
					</div>
				)}
			</Modal>
		</PageContainer>
	);
};
