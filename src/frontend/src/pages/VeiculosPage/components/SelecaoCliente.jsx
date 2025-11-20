import { Grid, Section, Select } from "../../../components/ui";

export const SelecaoCliente = ({ clienteId, alterarCliente, clientesData }) => {
	if (!clientesData?.itens?.length) {
		return (
			<Section>
				<p>Carregando clientes...</p>
			</Section>
		);
	}

	return (
		<Section>
			<Grid>
				<div
					style={{
						display: "flex",
						gap: "10px",
						alignItems: "center",
					}}
				>
					<label htmlFor="cliente-select">Cliente:</label>
					<Select
						id="cliente-select"
						value={clienteId}
						onChange={(e) => alterarCliente(e.target.value)}
					>
						{clientesData.itens.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nome}
							</option>
						))}
					</Select>
				</div>
			</Grid>
		</Section>
	);
};
