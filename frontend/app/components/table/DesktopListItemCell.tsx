interface DesktopListItemCellProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
}

export function DesktopListItemCell({ children, className = 'whitespace-nowrap', title }: DesktopListItemCellProps) {
	return (
		<td className={className} style={{ overflow: 'hidden', maxWidth: '0' }}>
			{title ? (
				<div className="max-w-md truncate overflow-hidden" title={title}>
					{children}
				</div>
			) : (
				<div className="overflow-hidden">
					{children}
				</div>
			)}
		</td>
	);
}



