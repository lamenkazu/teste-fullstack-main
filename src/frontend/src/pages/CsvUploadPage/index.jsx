import { PageContainer, PageTitle, SectionTitle } from "../../components/ui";
import { ImportarCsv } from "./components/ImportarCsv";
import { Relatorio } from "./components/Relatorio";
import { useCsvUploadViewModel } from "./useCsvUploadViewModel";

export const CsvUploadPage = () => {
	const vm = useCsvUploadViewModel();

	return (
		<PageContainer>
			<PageTitle>Importar CSV</PageTitle>

			<SectionTitle>Importar CSV</SectionTitle>
			<ImportarCsv
				arquivoSelecionado={vm.arquivoSelecionado}
				handleFileSelect={vm.handleFileSelect}
				handleUpload={vm.handleUpload}
				isUploading={vm.isUploading}
			/>

			<SectionTitle style={{ marginTop: "16px" }}>Relatório</SectionTitle>
			<Relatorio log={vm.log} isUploading={vm.isUploading} />
		</PageContainer>
	);
};
