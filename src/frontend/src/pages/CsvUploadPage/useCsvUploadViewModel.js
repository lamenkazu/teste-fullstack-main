import { useState } from "react";

export const useCsvUploadViewModel = () => {
	// Estados locais
	const [log, setLog] = useState(null);
	const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	// Função para fazer upload do arquivo CSV
	const handleUpload = async (event) => {
		event.preventDefault();

		if (!arquivoSelecionado) {
			alert("Por favor, selecione um arquivo CSV.");
			return;
		}

		setIsUploading(true);
		setLog(null);

		try {
			const fd = new FormData();
			fd.append("file", arquivoSelecionado);

			const response = await fetch(
				(import.meta.env.VITE_API_URL || "http://localhost:5000") +
					"/api/import/csv",
				{
					method: "POST",
					body: fd,
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setLog(data);
			setArquivoSelecionado(null); // Limpar arquivo após upload bem-sucedido
		} catch (error) {
			console.error("Erro ao fazer upload:", error);
			setLog({
				erro: true,
				mensagem: `Erro ao processar arquivo: ${error.message}`,
			});
		} finally {
			setIsUploading(false);
		}
	};

	// Função para selecionar arquivo
	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
				alert("Por favor, selecione um arquivo CSV válido.");
				event.target.value = "";
				return;
			}
			setArquivoSelecionado(file);
		}
	};

	// Retorna todo o estado e funções que os componentes precisam
	return {
		// Estados
		log,
		arquivoSelecionado,
		isUploading,

		// Funções
		handleUpload,
		handleFileSelect,
	};
};
