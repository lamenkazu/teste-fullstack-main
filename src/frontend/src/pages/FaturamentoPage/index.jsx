import { PageContainer, PageTitle, SectionTitle } from "../../components/ui";
import { Faturamento } from "./components/Faturamento";
import { Faturas } from "./components/Faturas";
import { useFaturamentoViewModel } from "./useFaturamentoViewModel";

export const FaturamentoPage = () => {
	const vm = useFaturamentoViewModel();

	return (
		<PageContainer>
			<PageTitle>Faturamento</PageTitle>

			<SectionTitle>Gerar faturas</SectionTitle>
			<Faturamento
				competencia={vm.competencia}
				setCompetencia={vm.setCompetencia}
				gerarFaturas={vm.gerarFaturas}
				gerarFaturasMutation={vm.gerarFaturasMutation}
			/>

			<SectionTitle style={{ marginTop: "16px" }}>Faturas</SectionTitle>
			<Faturas
				faturasData={vm.faturasData}
				isLoading={vm.isLoading}
				formatarValor={vm.formatarValor}
			/>
		</PageContainer>
	);
};
