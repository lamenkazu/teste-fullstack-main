import { Modal } from "../../components/Modal";
import {
	ErrorAlert,
	PageContainer,
	PageTitle,
	SectionTitle,
} from "../../components/ui";
import { FormularioEdicaoVeiculo } from "./components/FormularioEdicaoVeiculo";
import { ListaVeiculos } from "./components/ListaVeiculos";
import { NovoVeiculo } from "./components/NovoVeiculo";
import { SelecaoCliente } from "./components/SelecaoCliente";
import { useVeiculosViewModel } from "./useVeiculosViewModel";

export const VeiculosPage = () => {
	const vm = useVeiculosViewModel();

	return (
		<PageContainer>
			<PageTitle>Veículos</PageTitle>

			<SelecaoCliente
				clienteId={vm.clienteId}
				alterarCliente={vm.alterarCliente}
				clientesData={vm.clientesData}
			/>

			<SectionTitle>Novo veículo</SectionTitle>
			<NovoVeiculo
				form={vm.form}
				setForm={vm.setForm}
				criarVeiculo={vm.criarVeiculo}
				createMutation={vm.createMutation}
			/>

			<SectionTitle style={{ marginTop: "16px" }}>Lista</SectionTitle>
			<ListaVeiculos
				veiculosData={vm.veiculosData}
				isLoading={vm.isLoading}
				abrirModalEdicao={vm.abrirModalEdicao}
				removerMutation={vm.removerMutation}
			/>

			{/* Modal de Edição */}
			<Modal
				titulo="Editar Veículo"
				isOpen={vm.modalAberta}
				onClose={vm.fecharModal}
			>
				{vm.veiculoEdicao && (
					<div>
						{vm.erroEdicao && <ErrorAlert>{vm.erroEdicao}</ErrorAlert>}
						<FormularioEdicaoVeiculo
							veiculo={vm.veiculoEdicao}
							onSubmit={vm.salvarEdicao}
							onCancel={vm.fecharModal}
							isLoading={vm.atualizarMutation.isLoading}
							clientesData={vm.clientesData}
						/>
					</div>
				)}
			</Modal>
		</PageContainer>
	);
};
