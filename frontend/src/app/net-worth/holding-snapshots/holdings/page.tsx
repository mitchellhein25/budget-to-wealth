'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker';
import { Holding } from '@/app/lib/models/net-worth/Holding';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import ListTable from '@/app/ui/components/table/ListTable';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { getMonthRange, MessageState } from '@/app/ui/components/cashflow/CashFlowUtils';
import DatePicker from '@/app/ui/components/DatePicker';

export default function HoldingsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
	const [holdings, setHoldings] = useState<Holding[]>([]);
	// const [editingFormData, setEditingFormData] = useState<Partial<CashFlowEntryFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

	const clearMessage = useCallback(() => {
		setTimeout(() => setMessage({ type: null, text: '' }), 1000 * 10);
	}, []);

	const setInfoMessage = useCallback((text: string) => {
		setMessage({ type: 'info', text });
		clearMessage();
	}, [clearMessage]);

	const setErrorMessage = useCallback((text: string) => {
		setMessage({ type: 'error', text });
		clearMessage();
	}, [clearMessage]);

	// const handleSubmit = (formData: FormData) => handleCashFlowFormSubmit(
	// 	formData,
	// 	setIsSubmitting,
	// 	setMessage,
	// 	setErrorMessage,
	// 	setInfoMessage,
	// 	fetchEntries,
	// 	setEditingFormData,
	// 	props.cashFlowType
	// );

	// const onEntryIsEditing = (holding: Holding) => {
	// 	setEditingFormData({
	// 		id: holding.id?.toString(),
	// 		name: holding.name,
	// 		type: holding.type,
	// 		categoryId: holding.categoryId,
	// 	});
	// 	setMessage({ type: null, text: '' });
	// };

	const fetchEntries = async () => {
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await getRequest<Holding>("Holdings");
      if (!response.successful) {
        setErrorMessage(`Failed to load holdings. Please try again.`);
        return;
      }
      setHoldings(response.data as Holding[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading holdings.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

	// const onReset = () => {
	// 	setEditingFormData({});
	// 	setMessage({ type: null, text: '' });
	// };

	useEffect(() => {
		fetchEntries();
	}, []);
  async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteRequest<Holding>("Holdings", id);
			if (result.successful)
				fetchEntries();
		}
	};

	const tableHeaderRow = (
		<tr>
			<th className="w-1/5">Name</th>
			<th className="w-1/5">Type</th>
			<th className="w-3/10">Category</th>
			<th></th>
		</tr>
	);

	const tableBodyRow = (holding: Holding) => (
    console.log(holding),
		<tr key={holding.id}>
			<td className="flex-1">
				{holding.name}
			</td>
			<td className="flex-1">
				{holding.holdingCategory?.name}
			</td>
			<td className="flex-1">
				{holding.type}
			</td>
			<td className="flex space-x-2">
				<button
					id="edit-button"
					// onClick={() => onEntryIsEditing(holding)}
					className="p-1 hover:text-primary"
					aria-label="Edit"
				>
					<Pencil size={16} />
				</button>
				<button
					id="delete-button"
					onClick={() => handleDelete(holding.id as number)}
					className="p-1 hover:text-error"
					aria-label="Delete"
				>
					<Trash2 size={16} />
				</button>
			</td>
		</tr>
	);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      {/* <CashflowSideBar /> */}
      <div className="flex flex-1 gap-6">
        {/* <div className="flex-shrink-0">
          <CashFlowEntriesForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => cashFlowFormOnChange(event, setEditingFormData, props.cashFlowType)}
            onReset={onReset}
            errorMessage={message.type === 'error' ? message.text : ''}
            infoMessage={message.type === 'info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            cashFlowType={props.cashFlowType}
          />
        </div> */}
        <div className="flex flex-1 flex-col gap-2">
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <ListTable
            items={holdings}
            bodyRow={tableBodyRow}
            headerRow={tableHeaderRow}
            isLoading={isLoading}
            isError={message.type === 'error'}
            title="Holdings"
          />
        </div>
      </div>
    </div>
  )
}
