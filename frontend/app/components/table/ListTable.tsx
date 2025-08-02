import React, { useState, useMemo } from 'react';
import TablePagination from './TablePagination';

export type ListTableItem = (
  | { name: string }
  | { date: string }
);

export type ListTableProps<T extends ListTableItem> = {
  title: string;
  items: T[];
  headerRow: React.ReactNode;
  bodyRow: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function ListTable<T extends ListTableItem>(props: ListTableProps<T>) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = props.itemsPerPage || 10;

	const sortedItems = useMemo(() => {
		return [...props.items].sort((a, b) => {
			if ('date' in a && 'date' in b) {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateB.getTime() - dateA.getTime();
			}
			
			if ('name' in a && 'name' in b) {
				return (a.name as string).localeCompare(b.name as string);
			}
			
			return 0;
		});
	}, [props.items]);

	const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = sortedItems.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className="card bg-base-100 shadow-xl border border-base-300">
			<div className="card-body p-0">
				<div className="px-6 py-4 border-b border-base-300 bg-base-200/50">
					<h2 className="card-title text-xl text-base-content">{props.title}</h2>
					{props.items.length > 0 && (
						<p className="text-sm text-base-content/70 mt-1">
							{props.items.length} {props.items.length === 1 ? 'item' : 'items'} total
						</p>
					)}
				</div>
				
				<div className="p-6">
					{props.isError && (
						<div className="alert alert-error mb-6">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
							<span>Failed to load data. Please try again.</span>
						</div>
					)}
					
					{props.isLoading && !props.isError && (
						<div className="flex justify-center items-center py-12">
							<div className="flex items-center space-x-3">
								<span className="loading loading-spinner loading-md text-primary"></span>
								<span className="text-base-content/70 font-medium">Loading...</span>
							</div>
						</div>
					)}
					
					{!props.isLoading && !props.isError && (
						<>
							{props.items.length === 0 ? (
								<div className="text-center py-12">
									<svg className="mx-auto h-12 w-12 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<h3 className="mt-2 text-sm font-medium text-base-content">No items found</h3>
									<p className="mt-1 text-sm text-base-content/70">Get started by adding your first item.</p>
								</div>
							) : (
								<>
									<div className="overflow-hidden rounded-lg border border-base-300">
										<div className="overflow-x-auto">
											<table className="table table-zebra w-full">
												<thead>
													{props.headerRow}
												</thead>
												<tbody>
													{currentItems.map((item, index) => (
														<React.Fragment key={index}>
															{props.bodyRow(item)}
														</React.Fragment>
													))}
												</tbody>
											</table>
										</div>
									</div>
									
									{totalPages > 1 && (
										<div className="mt-6">
											<TablePagination
												currentPage={currentPage}
												totalPages={totalPages}
												handlePageChange={handlePageChange}
												handlePrevious={handlePrevious}
												handleNext={handleNext}
											/>
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
