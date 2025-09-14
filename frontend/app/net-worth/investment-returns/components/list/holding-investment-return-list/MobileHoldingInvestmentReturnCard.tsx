import { convertToDate, convertToDateMonthYear } from "@/app/lib/utils";
import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";
import { getHoldingInvestmentReturnDisplayName, HoldingInvestmentReturn } from "@/app/net-worth/investment-returns";

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
