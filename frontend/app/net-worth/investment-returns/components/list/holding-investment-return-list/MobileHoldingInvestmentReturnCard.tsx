import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent, convertToDate, convertToDateMonthYear } from "@/app/components";
import { getHoldingInvestmentReturnDisplayName, HoldingInvestmentReturn } from "../../HoldingInvestmentReturn";

interface MobileHoldingInvestmentReturnCardProps {
	investmentReturn: HoldingInvestmentReturn;
	onEdit: (investmentReturn: HoldingInvestmentReturn) => void;
	onDelete: (id: number) => void;
}

export function MobileHoldingInvestmentReturnCard({ investmentReturn, onEdit, onDelete }: MobileHoldingInvestmentReturnCardProps) {
	const handleEdit = () => onEdit(investmentReturn);
	const handleDelete = () => onDelete(investmentReturn.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<>
						<div className="text-lg font-bold text-base-content">
							{getHoldingInvestmentReturnDisplayName(investmentReturn)}
						</div>
					</>
				}
				rightContent={`${investmentReturn.returnPercentage}%`}
			/>
			<MobileListItemCardContent
				description={
					`${convertToDateMonthYear(convertToDate(investmentReturn.endHoldingSnapshot?.date))}`
				}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
