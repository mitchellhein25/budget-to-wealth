import { convertToDate, convertToDateMonthYear } from "@/app/lib/utils";
import { DesktopListItemCell, DesktopListItemRow } from "@/app/components";
import { getHoldingInvestmentReturnDisplayName, HoldingInvestmentReturn } from "@/app/net-worth/investment-returns";

interface DesktopHoldingInvestmentReturnRowProps {
	investmentReturn: HoldingInvestmentReturn;
	onEdit: (investmentReturn: HoldingInvestmentReturn) => void;
	onDelete: (id: number) => void;
}

export function DesktopHoldingInvestmentReturnRow(props: DesktopHoldingInvestmentReturnRowProps) {
	const handleEdit = () => props.onEdit(props.investmentReturn as HoldingInvestmentReturn);
	const handleDelete = () => props.onDelete(props.investmentReturn.id as number);
	
  return (
    <DesktopListItemRow
      key={props.investmentReturn.id}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
		<DesktopListItemCell title={getHoldingInvestmentReturnDisplayName(props.investmentReturn)}>
			{getHoldingInvestmentReturnDisplayName(props.investmentReturn)}
		</DesktopListItemCell>
		<DesktopListItemCell className="font-medium">
			{props.investmentReturn.returnPercentage}%
		</DesktopListItemCell>
		<DesktopListItemCell>
			{convertToDateMonthYear(convertToDate(props.investmentReturn.endHoldingSnapshot?.date))}
		</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
