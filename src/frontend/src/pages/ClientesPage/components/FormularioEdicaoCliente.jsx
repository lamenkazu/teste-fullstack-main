import { useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import {
	ButtonGroup,
	Checkbox,
	CheckboxContainer,
	CheckboxLabel,
	ErrorMessage,
	FormContainer,
	FormGroup,
	Input,
	Label,
	Textarea,
} from "../../../components/ui";
import { ValorMensalidadeInput } from "./styles/FormularioEdicaoCliente.styles";

export const FormularioEdicaoCliente = ({
	cliente,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			nome: cliente?.nome || "",
			telefone: cliente?.telefone || "",
			endereco: cliente?.endereco || "",
			mensalista: cliente?.mensalista || false,
			valorMensalidade: cliente?.valorMensalidade || "",
		},
	});

	const onFormSubmit = (data) => {
		onSubmit({
			...data,
			valorMensalidade:
				data.mensalista && data.valorMensalidade
					? Number(data.valorMensalidade)
					: null,
		});
	};

	return (
		<FormContainer onSubmit={handleSubmit(onFormSubmit)}>
			<FormGroup>
				<Label for="nome">Nome *</Label>
				<Input
					type="text"
					id="nome"
					$error={errors.nome}
					{...register("nome", {
						required: "Nome é obrigatório",
						minLength: {
							value: 2,
							message: "Nome deve ter pelo menos 2 caracteres",
						},
						maxLength: {
							value: 200,
							message: "Nome deve ter no máximo 200 caracteres",
						},
					})}
					placeholder="Digite o nome do cliente"
				/>
				{errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
			</FormGroup>

			<FormGroup>
				<Label for="telefone">Telefone</Label>
				<Input
					type="text"
					id="telefone"
					$error={errors.telefone}
					{...register("telefone", {
						maxLength: {
							value: 20,
							message: "Telefone deve ter no máximo 20 caracteres",
						},
					})}
					placeholder="Digite o telefone"
				/>
				{errors.telefone && (
					<ErrorMessage>{errors.telefone.message}</ErrorMessage>
				)}
			</FormGroup>

			<FormGroup>
				<Label for="endereco">Endereço</Label>
				<Textarea
					id="endereco"
					$error={errors.endereco}
					{...register("endereco", {
						maxLength: {
							value: 400,
							message: "Endereço deve ter no máximo 400 caracteres",
						},
					})}
					placeholder="Digite o endereço"
				/>
				{errors.endereco && (
					<ErrorMessage>{errors.endereco.message}</ErrorMessage>
				)}
			</FormGroup>

			<FormGroup>
				<CheckboxContainer>
					<Checkbox
						type="checkbox"
						id="mensalista"
						{...register("mensalista")}
					/>
					<CheckboxLabel for="mensalista">Cliente Mensalista</CheckboxLabel>
				</CheckboxContainer>
			</FormGroup>

			<FormGroup>
				<Label for="valorMensalidade">Valor da Mensalidade</Label>
				<ValorMensalidadeInput
					type="number"
					step="0.01"
					min="0"
					id="valorMensalidade"
					$error={errors.valorMensalidade}
					{...register("valorMensalidade", {
						validate: (value) => {
							if (value && Number(value) < 0) {
								return "Valor deve ser positivo";
							}
							return true;
						},
					})}
					placeholder="0.00"
					disabled={!watch("mensalista")}
				/>
				{errors.valorMensalidade && (
					<ErrorMessage>{errors.valorMensalidade.message}</ErrorMessage>
				)}
				{/* <HelpText>* Preencha apenas se o cliente for mensalista</HelpText> */}
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
