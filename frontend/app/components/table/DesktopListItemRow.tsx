import React from 'react';
import { EditButton, DeleteButton } from '@/app/components';

interface DesktopListItemRowProps {
	children: React.ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	className?: string;
  customActionButton?: React.ReactNode;
  actionColumnWidth?: string;
}

export function DesktopListItemRow({ children, onEdit, onDelete, customActionButton, className = '', actionColumnWidth }: DesktopListItemRowProps) {
	return (
		<tr className={`hover ${className}`}>
			{children}
			<td className={`${actionColumnWidth || 'w-1/12'} text-center overflow-hidden`}>
				<div className="flex items-center justify-center space-x-1 max-w-full">
          {customActionButton}
          <EditButton onClick={onEdit} />
					<DeleteButton onClick={onDelete} />
				</div>
			</td>
		</tr>
	);
}
