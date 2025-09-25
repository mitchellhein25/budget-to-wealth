import { convertToDate, convertToDateMonthYear } from "@/app/lib/utils";
import { DesktopListItemCell, DesktopListItemRow } from "@/app/components";
import { getManualInvestmentReturnDisplayName, ManualInvestmentReturn } from "@/app/net-worth/investment-returns";

interface DesktopManualInvestmentReturnRowProps {
	investmentReturn: ManualInvestmentReturn;
	onEdit: (investmentReturn: ManualInvestmentReturn) => void;
	onDelete: (id: number) => void;
	columnWidths: {
		investment: string;
		return: string;
		month: string;
		actions: string;
	};
}

export function DesktopManualInvestmentReturnRow(props: DesktopManualInvestmentReturnRowProps) {
	const handleEdit = () => props.onEdit(props.investmentReturn as ManualInvestmentReturn);
	const handleDelete = () => props.onDelete(props.investmentReturn.id as number);
	
  return (
    <DesktopListItemRow
      key={props.investmentReturn.id}
      onEdit={handleEdit}
      onDelete={handleDelete}
      actionColumnWidth={props.columnWidths.actions}
    >
			<DesktopListItemCell title={getManualInvestmentReturnDisplayName(props.investmentReturn)} className={props.columnWidths.investment}>
				{getManualInvestmentReturnDisplayName(props.investmentReturn)}
			</DesktopListItemCell>
			<DesktopListItemCell className={props.columnWidths.return + " whitespace-nowrap font-medium"}>
				{props.investmentReturn.manualInvestmentPercentageReturn}%
			</DesktopListItemCell>
			<DesktopListItemCell className={props.columnWidths.month}>
				{convertToDateMonthYear(convertToDate(props.investmentReturn.startDate))} - {convertToDateMonthYear(convertToDate(props.investmentReturn.endDate))}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
