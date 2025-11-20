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

export const ListaClientes = ({
	clientesData,
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

	return (
		<Section>
			<Table>
				<TableHead>
					<TableRow>
						<TableHeader>Nome</TableHeader>
						<TableHeader>Telefone</TableHeader>
						<TableHeader>Mensalista</TableHeader>
						<TableHeader>Valor Mensalidade</TableHeader>
						<TableHeader>Ações</TableHeader>
						<TableHeader></TableHeader>
					</TableRow>
				</TableHead>
				<tbody>
					{clientesData?.itens?.map((c) => (
						<TableRow key={c.id}>
							<TableCell>{c.nome}</TableCell>
							<TableCell>{c.telefone}</TableCell>
							<TableCell>{c.mensalista ? "Sim" : "Não"}</TableCell>
							<TableCell>
								{c.valorMensalidade
									? `R$ ${Number(c.valorMensalidade).toFixed(2)}`
									: "-"}
							</TableCell>

							<TableCell>
								<Button
									variant="ghost"
									onClick={() => {
										if (
											confirm(
												`Tem certeza que deseja excluir o cliente "${c.nome}"?`,
											)
										) {
											removerMutation.mutate(c.id);
										}
									}}
								>
									Excluir
								</Button>
							</TableCell>

							<TableCell>
								<Button variant="ghost" onClick={() => abrirModalEdicao(c)}>
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
