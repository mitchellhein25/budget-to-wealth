import { Equal, ArrowUp, ArrowDown } from 'lucide-react';
import { convertCentsToDollars } from '@/app/lib/utils';
import { DesktopListItemRow, DesktopListItemCell, TruncatedBadge } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow';
import { Budget } from '@/app/cashflow/budget';

interface DesktopBudgetRowProps {
	budget: Budget;
	expenses: CashFlowEntry[];
	onEdit: (budget: Budget) => void;
	onDelete: (id: number) => void;
	columnWidths: {
		category: string;
		amount: string;
		spent: string;
		remaining: string;
		actions: string;
	};
}

export function DesktopBudgetRow({ budget, expenses, onEdit, onDelete, columnWidths }: DesktopBudgetRowProps) {
	const getAmountSpentInCategory = (categoryId: string) => {
		return expenses.filter(expense => expense.categoryId === categoryId)
			.reduce((acc, expense) => acc + expense.amount, 0);
	};

	const getRemainingBudget = (budget: Budget) => {
		return budget.amount - getAmountSpentInCategory(budget.categoryId);
	};

	const remainingBudget = getRemainingBudget(budget);
	const handleEdit = () => onEdit(budget);
	const handleDelete = () => onDelete(budget.id as number);

	return (
		<DesktopListItemRow key={budget.id} onEdit={handleEdit} onDelete={handleDelete} actionColumnWidth={columnWidths.actions}>
			<DesktopListItemCell className={columnWidths.category}>
				{budget.category?.name && (
					<TruncatedBadge title={budget.category.name}>
						{budget.category.name}
					</TruncatedBadge>
				)}
			</DesktopListItemCell>
			<DesktopListItemCell className={columnWidths.amount + " whitespace-nowrap font-medium"} title={convertCentsToDollars(budget.amount)}>
				{convertCentsToDollars(budget.amount)}
			</DesktopListItemCell>
			<DesktopListItemCell className={columnWidths.spent + " whitespace-nowrap"} title={convertCentsToDollars(getAmountSpentInCategory(budget.categoryId))}>
				{convertCentsToDollars(getAmountSpentInCategory(budget.categoryId))}
			</DesktopListItemCell>
			<DesktopListItemCell className={columnWidths.remaining + " whitespace-nowrap"} title={convertCentsToDollars(remainingBudget)}>
				<div className="flex items-center space-x-2">
					<span>{convertCentsToDollars(remainingBudget)}</span>
					<span className={remainingBudget === 0 ? "text-yellow-500" : remainingBudget > 0 ? "text-green-500" : "text-red-500"}>
						{remainingBudget === 0 ? <Equal size={18} /> : remainingBudget > 0 ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
					</span>
				</div>
			</DesktopListItemCell>
		</DesktopListItemRow>
	);
} 