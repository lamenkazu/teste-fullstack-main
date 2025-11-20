import { Grid, Input, Section, Select } from "../../../components/ui";

export const BuscaClientes = ({
	filtro,
	setFiltro,
	mensalista,
	setMensalista,
}) => {
	return (
		<Section>
			<Grid className="grid-3">
				<Input
					placeholder="Buscar por nome"
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				/>
				<Select
					value={mensalista}
					onChange={(e) => setMensalista(e.target.value)}
				>
					<option value="all">Todos</option>
					<option value="true">Mensalistas</option>
					<option value="false">Não mensalistas</option>
				</Select>
				<div />
			</Grid>
		</Section>
	);
};
