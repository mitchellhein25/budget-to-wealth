import { convertToDate, convertToDateMonthYear } from "@/app/lib/utils";
import { DesktopListItemCell, DesktopListItemRow } from "@/app/components";
import { getManualInvestmentReturnDisplayName, ManualInvestmentReturn } from "@/app/net-worth/investment-returns";

interface DesktopManualInvestmentReturnRowProps {
	investmentReturn: ManualInvestmentReturn;
	onEdit: (investmentReturn: ManualInvestmentReturn) => void;
	onDelete: (id: number) => void;
}

export function DesktopManualInvestmentReturnRow(props: DesktopManualInvestmentReturnRowProps) {
	const handleEdit = () => props.onEdit(props.investmentReturn as ManualInvestmentReturn);
	const handleDelete = () => props.onDelete(props.investmentReturn.id as number);
	
  return (
    <DesktopListItemRow
      key={props.investmentReturn.id}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
			<DesktopListItemCell title={getManualInvestmentReturnDisplayName(props.investmentReturn)}>
				{getManualInvestmentReturnDisplayName(props.investmentReturn)}
			</DesktopListItemCell>
			<DesktopListItemCell className="whitespace-nowrap font-medium">
				{props.investmentReturn.manualInvestmentPercentageReturn}%
			</DesktopListItemCell>
			<DesktopListItemCell>
				{convertToDateMonthYear(convertToDate(props.investmentReturn.manualInvestmentReturnDate))}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
