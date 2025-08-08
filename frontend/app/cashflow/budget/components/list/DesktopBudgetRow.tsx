import { Equal, ArrowUp, ArrowDown } from 'lucide-react';
import { convertCentsToDollars, DesktopListItemRow, DesktopListItemCell } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow/components';
import { Budget } from '..';

interface DesktopBudgetRowProps {
	budget: Budget;
	expenses: CashFlowEntry[];
	onEdit: (budget: Budget) => void;
	onDelete: (id: number) => void;
}

export default function DesktopBudgetRow({ budget, expenses, onEdit, onDelete }: DesktopBudgetRowProps) {
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
		<DesktopListItemRow key={budget.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell>
				{budget.category?.name}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{convertCentsToDollars(budget.amount)}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{convertCentsToDollars(getAmountSpentInCategory(budget.categoryId))}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{convertCentsToDollars(remainingBudget)}
			</DesktopListItemCell>
			<DesktopListItemCell className={"flex-1 " + (remainingBudget === 0 ? "text-yellow-500" : remainingBudget > 0 ? "text-green-500" : "text-red-500")}>
				{remainingBudget === 0 ? <Equal size={22} /> : remainingBudget > 0 ? <ArrowDown size={22} /> : <ArrowUp size={22} />}
			</DesktopListItemCell>
		</DesktopListItemRow>
	);
} 