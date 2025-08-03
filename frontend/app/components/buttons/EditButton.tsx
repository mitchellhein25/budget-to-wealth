import { Pencil } from 'lucide-react';

interface EditButtonProps {
	onClick: () => void;
	className?: string;
	ariaLabel?: string;
}

export function EditButton({ 
  onClick, 
  className, 
  ariaLabel 
}: EditButtonProps) {
	return (
		<button
			id="edit-button"
			onClick={onClick}
			className={className ?? "btn btn-ghost btn-xs text-primary hover:bg-primary hover:text-primary-content"}
			aria-label={ariaLabel ?? "Edit"}
		>
			<Pencil size={16} />
		</button>
	);
} 