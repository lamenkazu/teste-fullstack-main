import { Button } from "../../../components/Button";
import {
	Checkbox,
	CheckboxContainer,
	Input,
	Section,
} from "../../../components/ui";
import {
	CustomGrid,
	ValorMensalidadeInput,
} from "./styles/FormularioEdicaoCliente.styles";

export const NovoCliente = ({ form, setForm, createMutation }) => {
	const handleSubmit = () => {
		createMutation.mutate({
			nome: form.nome,
			telefone: form.telefone,
			endereco: form.endereco,
			mensalista: form.mensalista,
			valorMensalidade:
				form.mensalista && form.valorMensalidade
					? Number(form.valorMensalidade)
					: null,
		});
	};

	return (
		<Section>
			<CustomGrid>
				<Input
					placeholder="Nome"
					value={form.nome}
					onChange={(e) => setForm({ ...form, nome: e.target.value })}
				/>
				<Input
					placeholder="Telefone"
					value={form.telefone}
					onChange={(e) => setForm({ ...form, telefone: e.target.value })}
				/>
				<div className="second-row">
					<Input
						placeholder="Endereço"
						value={form.endereco}
						onChange={(e) => setForm({ ...form, endereco: e.target.value })}
					/>
					<CheckboxContainer>
						<Checkbox
							type="checkbox"
							checked={form.mensalista}
							onChange={(e) =>
								setForm({
									...form,
									mensalista: e.target.checked,
									valorMensalidade: e.target.checked
										? form.valorMensalidade
										: "",
								})
							}
						/>
						Mensalista
					</CheckboxContainer>
				</div>
				{/* <div className="third-row"> */}
				<ValorMensalidadeInput
					placeholder="Valor mensalidade"
					value={form.valorMensalidade}
					onChange={(e) =>
						setForm({ ...form, valorMensalidade: e.target.value })
					}
					disabled={!form.mensalista}
				/>
				<Button variant="primary" onClick={handleSubmit}>
					Salvar
				</Button>
				{/* </div> */}
			</CustomGrid>
		</Section>
	);
};
