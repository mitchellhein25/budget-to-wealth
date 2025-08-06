import { Equal, ArrowUp, ArrowDown } from 'lucide-react';
import { convertCentsToDollars } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow/components';
import { Budget } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

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

	return (
		<tr key={budget.id} className="hover">
			<td className="flex-1">
				{budget.category?.name}
			</td>
			<td className="flex-1">
				{convertCentsToDollars(budget.amount)}
			</td>
			<td className="flex-1">
				{convertCentsToDollars(getAmountSpentInCategory(budget.categoryId))}
			</td>
			<td className="flex-1">
				{convertCentsToDollars(remainingBudget)}
			</td>
			<td className={"flex-1 " + (remainingBudget === 0 ? "text-yellow-500" : remainingBudget > 0 ? "text-green-500" : "text-red-500")}>
				{remainingBudget === 0 ? <Equal size={22} /> : remainingBudget > 0 ? <ArrowDown size={22} /> : <ArrowUp size={22} />}
			</td>
			<td className="flex space-x-2">
				<EditButton 
					onClick={() => onEdit(budget)}
					className="p-1 hover:text-primary"
				/>
				<DeleteButton 
					onClick={() => onDelete(budget.id as number)}
					className="p-1 hover:text-error"
				/>
			</td>
		</tr>
	);
} 