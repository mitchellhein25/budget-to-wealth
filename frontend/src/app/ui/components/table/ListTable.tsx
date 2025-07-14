import React, { useState } from 'react';
import TablePagination from './TablePagination';

export type ListTableItem = {
  id: string | number;
}

export type ListTableProps<T extends ListTableItem> = {
  title: string;
  items: T[];
  headerRow: React.ReactNode;
  bodyRow: (item: T) => React.ReactNode;
  itemsPerPage?: number;
}

export default function ListTable<T extends ListTableItem>(props: ListTableProps<T>) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = props.itemsPerPage || 10;

	const totalPages = Math.ceil(props.items.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = props.items.slice(startIndex, endIndex);

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
		<div className="card bg-base-100 shadow-sm">
			<div className="card-body p-6">
				<h2 className="card-title text-lg mb-6">{props.title}</h2>
				<div className="overflow-x-auto">
					<table className="table table-zebra w-full">
						<thead>
							{props.headerRow}
						</thead>
						<tbody>
							{currentItems.map((item) => props.bodyRow(item))}
						</tbody>
					</table>
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
			</div>
		</div>
	);
}
