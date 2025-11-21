import { Button } from "../../../components/Button";
import { Input, Section } from "../../../components/ui";

export const Faturamento = ({
	competencia,
	setCompetencia,
	gerarFaturas,
	gerarFaturasMutation,
}) => {
	return (
		<Section>
			<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
				<Input
					type="month"
					placeholder="yyyy-MM"
					value={competencia}
					onChange={(e) => setCompetencia(e.target.value)}
				/>
				<Button
					variant="primary"
					onClick={gerarFaturas}
					disabled={gerarFaturasMutation.isLoading}
					style={{ width: "20%" }}
				>
					{gerarFaturasMutation.isLoading ? "Gerando..." : "Gerar faturas"}
				</Button>
			</div>
		</Section>
	);
};
