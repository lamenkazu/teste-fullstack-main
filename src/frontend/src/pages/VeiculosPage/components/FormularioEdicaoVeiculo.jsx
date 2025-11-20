import { useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import {
	ButtonGroup,
	FormContainer,
	FormGroup,
	Input,
	Label,
} from "../../../components/ui";

export const FormularioEdicaoVeiculo = ({
	veiculo,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			placa: veiculo?.placa || "",
			modelo: veiculo?.modelo || "",
			ano: veiculo?.ano || "",
		},
	});

	const onFormSubmit = (data) => {
		onSubmit({
			...data,
			ano: data.ano ? Number(data.ano) : null,
		});
	};

	return (
		<FormContainer onSubmit={handleSubmit(onFormSubmit)}>
			<FormGroup>
				<Label htmlFor="placa">Placa *</Label>
				<Input
					type="text"
					id="placa"
					$error={errors.placa}
					{...register("placa", {
						required: "Placa é obrigatória",
						minLength: {
							value: 7,
							message: "Placa deve ter pelo menos 7 caracteres",
						},
						maxLength: {
							value: 10,
							message: "Placa deve ter no máximo 10 caracteres",
						},
					})}
					placeholder="Digite a placa do veículo"
				/>
				{errors.placa && (
					<span style={{ color: "red", fontSize: "12px" }}>
						{errors.placa.message}
					</span>
				)}
			</FormGroup>

			<FormGroup>
				<Label htmlFor="modelo">Modelo *</Label>
				<Input
					type="text"
					id="modelo"
					$error={errors.modelo}
					{...register("modelo", {
						required: "Modelo é obrigatório",
						minLength: {
							value: 2,
							message: "Modelo deve ter pelo menos 2 caracteres",
						},
						maxLength: {
							value: 100,
							message: "Modelo deve ter no máximo 100 caracteres",
						},
					})}
					placeholder="Digite o modelo do veículo"
				/>
				{errors.modelo && (
					<span style={{ color: "red", fontSize: "12px" }}>
						{errors.modelo.message}
					</span>
				)}
			</FormGroup>

			<FormGroup>
				<Label htmlFor="ano">Ano</Label>
				<Input
					type="number"
					id="ano"
					$error={errors.ano}
					{...register("ano", {
						min: {
							value: 1900,
							message: "Ano deve ser maior que 1900",
						},
						max: {
							value: new Date().getFullYear() + 1,
							message: `Ano deve ser menor que ${new Date().getFullYear() + 1}`,
						},
					})}
					placeholder="Digite o ano do veículo"
				/>
				{errors.ano && (
					<span style={{ color: "red", fontSize: "12px" }}>
						{errors.ano.message}
					</span>
				)}
			</FormGroup>

			<ButtonGroup>
				<Button variant="cancel" onClick={onCancel} disabled={isLoading}>
					Cancelar
				</Button>
				<Button variant="primary" disabled={isLoading} type="submit">
					{isLoading ? "Salvando..." : "Salvar"}
				</Button>
			</ButtonGroup>
		</FormContainer>
	);
};
