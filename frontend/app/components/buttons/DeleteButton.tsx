import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
	onClick: () => void;
	className?: string;
	ariaLabel?: string;
}

export function DeleteButton({ 
  onClick, 
  className, 
  ariaLabel 
}: DeleteButtonProps) {
	return (
		<button
			id="delete-button"
			onClick={onClick}
			className={className ?? "btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"}
			aria-label={ariaLabel ?? "Delete"}
		>
			<Trash2 size={16} />
		</button>
	);
} 