import React from 'react';
import { EditButton, DeleteButton } from '@/app/components/buttons';

interface DesktopListItemRowProps {
	children: React.ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	className?: string;
}

export function DesktopListItemRow({ children, onEdit, onDelete, className = '' }: DesktopListItemRowProps) {
	return (
		<tr className={`hover ${className}`}>
			{children}
			<td className="text-right">
				<div className="flex items-center justify-end space-x-2">
					<EditButton onClick={onEdit} />
					<DeleteButton onClick={onDelete} />
				</div>
			</td>
		</tr>
	);
}

interface DesktopListItemCellProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
}

export function DesktopListItemCell({ children, className = 'whitespace-nowrap', title }: DesktopListItemCellProps) {
	return (
		<td className={className}>
			{title ? (
				<div className="max-w-xs truncate" title={title}>
					{children}
				</div>
			) : (
				children
			)}
		</td>
	);
}
