import { ButtonContainer } from "./ui/Button.styles";

export const Button = ({
	children,
	variant = "primary",
	className,
	disabled,
	...props
}) => {
	return (
		<ButtonContainer
			$variant={variant}
			className={className}
			disabled={disabled}
			{...props}
		>
			{children}
		</ButtonContainer>
	);
};
