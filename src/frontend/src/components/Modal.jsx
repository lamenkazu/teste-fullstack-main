import {
	CloseButton,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalTitle,
} from "./ui";

export const Modal = ({
	isOpen,
	onClose,
	titulo = "Editar Cliente",
	children,
}) => {
	if (!isOpen) return null;

	const handleKeyDown = (e) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	return (
		<ModalOverlay
			onClick={onClose}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				<ModalHeader>
					<ModalTitle id="modal-title">{titulo}</ModalTitle>
					<CloseButton onClick={onClose} aria-label="Fechar modal">
						×
					</CloseButton>
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</ModalOverlay>
	);
};
