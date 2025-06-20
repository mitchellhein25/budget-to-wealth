import React, { useState, useEffect } from 'react'
import TablePagination from './TablePagination';

interface ListTableProps<T extends ListTableItem> {
	title: string;
	items: T[];
	headerRow: React.ReactNode;
	bodyRow: (item: T) => React.ReactElement;
  isError: boolean;
  isLoading: boolean;
}

export type ListTableItem = { [key: string]: string | number | Date } & (
  | { name: string }
  | { date: string }
);

export default function ListTable<T extends ListTableItem>(props: ListTableProps<T>) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	const sortedItems = props.items.sort((a, b) => {
		if ('date' in a && 'date' in b) {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA.getTime() - dateB.getTime();
		}
		return (a?.name as string)?.localeCompare(b?.name as string ?? '') ?? 0;
	});
	const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(props.items.length / itemsPerPage);
  const titleLowerCase = props.title.toLowerCase();

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
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

	if (props.isError) {
		return (
			<p className="alert alert-error alert-soft">Failed to load {titleLowerCase}.</p>
		);
	}

	if (props.isLoading) {
		return (
			<p className="alert alert-info alert-soft">Loading {titleLowerCase}...</p>
		);
	}
	
	if (props.items.length === 0) {
		return (
			<div className="space-y-4 flex flex-col justify-center">
				<h2 className="text-lg text-center">{props.title}</h2>
				<p className="alert alert-warning alert-soft">You haven&apos;t added any {titleLowerCase} yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 flex flex-col justify-center">
			<h2 className="text-lg text-center">{props.title}</h2>
			<table className="table w-full">
				<thead>
					{props.headerRow}
				</thead>
				<tbody>
					{currentItems.map((item) => props.bodyRow(item))}
				</tbody>
			</table>
			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				handlePageChange={handlePageChange}
				handlePrevious={handlePrevious}
				handleNext={handleNext}
			/>
		</div>
	);
}
