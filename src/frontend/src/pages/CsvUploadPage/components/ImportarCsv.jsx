import { useEffect, useRef } from "react";
import { Button } from "../../../components/Button";
import { Section } from "../../../components/ui";

export const ImportarCsv = ({
	arquivoSelecionado,
	handleFileSelect,
	handleUpload,
	isUploading,
}) => {
	const inputRef = useRef(null);

	useEffect(() => {
		if (!arquivoSelecionado && !isUploading && inputRef.current) {
			inputRef.current.value = "";
		}
	}, [arquivoSelecionado, isUploading]);

	return (
		<Section>
			<form
				onSubmit={handleUpload}
				style={{ display: "flex", gap: "10px", alignItems: "center" }}
			>
				<input
					ref={inputRef}
					type="file"
					name="file"
					accept=".csv"
					onChange={handleFileSelect}
					disabled={isUploading}
				/>
				<Button
					variant="primary"
					type="submit"
					disabled={isUploading || !arquivoSelecionado}
				>
					{isUploading ? "Enviando..." : "Enviar"}
				</Button>
			</form>
			{arquivoSelecionado && !isUploading && (
				<p style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
					Arquivo selecionado: {arquivoSelecionado.name}
				</p>
			)}
		</Section>
	);
};
