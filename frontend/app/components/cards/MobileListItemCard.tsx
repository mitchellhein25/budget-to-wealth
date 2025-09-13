import React from 'react';
import { EditButton, DeleteButton } from '@/app/components';

interface MobileListItemCardProps {
	children: React.ReactNode;
	className?: string;
}

export function MobileListItemCard({ children, className = '' }: MobileListItemCardProps) {
	return (
		<div className={`card bg-base-100 border border-base-300 shadow-sm ${className}`}>
			<div className="card-body card-responsive p-3 sm:p-1.5">
				{children}
			</div>
		</div>
	);
}

interface MobileListItemCardHeaderProps {
	leftContent: React.ReactNode;
	rightContent?: React.ReactNode;
	className?: string;
}

export function MobileListItemCardHeader({ leftContent, rightContent, className = '' }: MobileListItemCardHeaderProps) {
	return (
		<div className={`flex items-center justify-between mb-2 sm:mb-3 ${className}`}>
			<div className="flex items-center space-x-2 sm:space-x-3">
				{leftContent}
			</div>
			{rightContent}
		</div>
	);
}

interface MobileListItemCardContentProps {
	description: React.ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	className?: string;
}

export function MobileListItemCardContent({ description, onEdit, onDelete, className = '' }: MobileListItemCardContentProps) {
	return (
		<div className={`flex items-start justify-between gap-2 sm:gap-3 ${className}`}>
			<div className="flex-1 min-w-0">
				{description}
			</div>
			<div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
				<EditButton onClick={onEdit} />
				<DeleteButton onClick={onDelete} />
			</div>
		</div>
	);
}
