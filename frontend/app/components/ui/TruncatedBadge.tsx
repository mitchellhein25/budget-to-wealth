interface TruncatedBadgeProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
}

export function TruncatedBadge({ children, className = '', title }: TruncatedBadgeProps) {
	return (
		<span 
			className={`inline-block px-2 py-1 text-xs font-medium bg-primary text-primary-content rounded-full max-w-full text-left overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
			title={title}
		>
			{children}
		</span>
	);
}
