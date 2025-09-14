import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";
import { convertToDate, convertToDateMonthYear } from "@/app/lib/utils";
import { getManualInvestmentReturnDisplayName, ManualInvestmentReturn } from "@/app/net-worth/investment-returns";

interface MobileManualInvestmentReturnCardProps {
	investmentReturn: ManualInvestmentReturn;
	onEdit: (investmentReturn: ManualInvestmentReturn) => void;
	onDelete: (id: number) => void;
}

export function MobileManualInvestmentReturnCard({ investmentReturn, onEdit, onDelete }: MobileManualInvestmentReturnCardProps) {
	const handleEdit = () => onEdit(investmentReturn);
	const handleDelete = () => onDelete(investmentReturn.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<>
						<div className="text-lg font-bold text-base-content">
							{getManualInvestmentReturnDisplayName(investmentReturn)}
						</div>
					</>
				}
				rightContent={`${investmentReturn.manualInvestmentPercentageReturn}%`}
			/>
			<MobileListItemCardContent
				description={
					`${convertToDateMonthYear(convertToDate(investmentReturn.manualInvestmentReturnDate))}`
				}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
