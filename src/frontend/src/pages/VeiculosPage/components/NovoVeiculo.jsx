import { Button } from "../../../components/Button";
import { Grid, Input, Section } from "../../../components/ui";

export const NovoVeiculo = ({
	form,
	setForm,
	criarVeiculo,
	createMutation,
}) => {
	const handleSubmit = () => {
		// Validação básica
		if (!form.placa || !form.modelo) {
			alert("Por favor, preencha pelo menos a placa e o modelo.");
			return;
		}
		criarVeiculo();
	};

	return (
		<Section>
			<Grid className="grid-4">
				<Input
					placeholder="Placa"
					value={form.placa}
					onChange={(e) => setForm({ ...form, placa: e.target.value })}
				/>
				<Input
					placeholder="Modelo"
					value={form.modelo}
					onChange={(e) => setForm({ ...form, modelo: e.target.value })}
				/>
				<Input
					placeholder="Ano"
					type="number"
					value={form.ano}
					onChange={(e) => setForm({ ...form, ano: e.target.value })}
				/>
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={createMutation.isLoading}
				>
					{createMutation.isLoading ? "Salvando..." : "Salvar"}
				</Button>
			</Grid>
		</Section>
	);
};
