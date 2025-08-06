import { Equal, ArrowUp, ArrowDown } from 'lucide-react';
import { convertCentsToDollars } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow/components';
import { Budget } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

interface MobileBudgetCardProps {
	budget: Budget;
	expenses: CashFlowEntry[];
	onEdit: (budget: Budget) => void;
	onDelete: (id: number) => void;
}

export function MobileBudgetCard({ budget, expenses, onEdit, onDelete }: MobileBudgetCardProps) {
	const getAmountSpentInCategory = (categoryId: string) => {
		return expenses.filter(expense => expense.categoryId === categoryId)
			.reduce((acc, expense) => acc + expense.amount, 0);
	};

	const getRemainingBudget = (budget: Budget) => {
		return budget.amount - getAmountSpentInCategory(budget.categoryId);
	};

	const remainingBudget = getRemainingBudget(budget);
	const amountSpent = getAmountSpentInCategory(budget.categoryId);

	const getStatusIcon = () => {
		if (remainingBudget === 0) {
			return <Equal size={20} className="text-yellow-500" />;
		} else if (remainingBudget > 0) {
			return <ArrowDown size={20} className="text-green-500" />;
		} else {
			return <ArrowUp size={20} className="text-red-500" />;
		}
	};

	return (
		<div className="card bg-base-100 border border-base-300 shadow-sm">
			<div className="card-body p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-3">
						<div className="text-sm font-medium text-base-content">
							{budget.category?.name}
						</div>
						{getStatusIcon()}
					</div>
					<div className="flex items-center space-x-2">
						<EditButton onClick={() => onEdit(budget)} />
						<DeleteButton onClick={() => onDelete(budget.id as number)} />
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex flex-col space-y-1">
						<div className="text-xs text-base-content/70">Budget</div>
						<div className="text-lg font-bold text-base-content">
							{convertCentsToDollars(budget.amount)}
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="text-xs text-base-content/70">Spent</div>
						<div className="text-base text-base-content">
							{convertCentsToDollars(amountSpent)}
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="text-xs text-base-content/70">Remaining</div>
						<div className={`text-base font-medium ${
							remainingBudget === 0 ? 'text-yellow-500' : 
							remainingBudget > 0 ? 'text-green-500' : 'text-red-500'
						}`}>
							{convertCentsToDollars(remainingBudget)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 