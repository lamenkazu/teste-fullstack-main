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

export const ListaVeiculos = ({
	veiculosData,
	isLoading,
	abrirModalEdicao,
	removerMutation,
}) => {
	if (isLoading) {
		return (
			<Section>
				<LoadingText>Carregando...</LoadingText>
			</Section>
		);
	}

	if (!veiculosData || !veiculosData.length) {
		return (
			<Section>
				<p>Nenhum veículo encontrado para este cliente.</p>
			</Section>
		);
	}

	return (
		<Section>
			<Table>
				<TableHead>
					<TableRow>
						<TableHeader>Placa</TableHeader>
						<TableHeader>Modelo</TableHeader>
						<TableHeader>Ano</TableHeader>
						<TableHeader>Ações</TableHeader>
						<TableHeader></TableHeader>
					</TableRow>
				</TableHead>
				<tbody>
					{veiculosData.map((v) => (
						<TableRow key={v.id}>
							<TableCell>{v.placa}</TableCell>
							<TableCell>{v.modelo}</TableCell>
							<TableCell>{v.ano ?? "-"}</TableCell>

							<TableCell>
								<Button
									variant="ghost"
									onClick={() => {
										if (
											confirm(
												`Tem certeza que deseja excluir o veículo ${v.placa}?`,
											)
										) {
											removerMutation.mutate(v.id);
										}
									}}
								>
									Excluir
								</Button>
							</TableCell>

							<TableCell>
								<Button variant="ghost" onClick={() => abrirModalEdicao(v)}>
									Editar
								</Button>
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>
		</Section>
	);
};
