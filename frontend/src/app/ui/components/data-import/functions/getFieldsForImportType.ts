export type ImportField = {
  name: string,
  type: string,
  required: boolean
}

export function getFieldsForImportType(dataType: string): ImportField[] {
  switch (dataType) {
    case "CashFlow Entries":
      return [
        { name: "amount", type: "number", required: true },
        { name: "entryType", type: "string", required: true },
        { name: "category", type: "string", required: true },
        { name: "date", type: "string", required: true },
        { name: "description", type: "string", required: false },
        { name: "recurrenceFrequency", type: "string", required: false }
      ];
    case "Holding Snapshots":
      return [
        { name: "balance", type: "number", required: true },
        { name: "holding", type: "string", required: true },
        { name: "date", type: "string", required: true }
      ];
    case "Holdings":
      return [
        { name: "name", type: "string", required: true },
        { name: "type", type: "string", required: true },
        { name: "holdingCategory", type: "string", required: true }
      ];
    case "Budgets":
      return [
        { name: "amount", type: "number", required: true },
        { name: "category", type: "string", required: true },
        { name: "name", type: "string", required: true }
      ];
    case "CashFlowCategory":
    default:
      return [
        { name: "name", type: "string", required: true },
        { name: "categoryType", type: "string", required: true }
      ];
  }
}