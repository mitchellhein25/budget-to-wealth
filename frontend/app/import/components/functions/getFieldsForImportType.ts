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
        { name: "categoryName", type: "string", required: true },
        { name: "categoryType", type: "string", required: true },
        { name: "date", type: "string", required: true },
        { name: "description", type: "string", required: false },
        { name: "recurrenceFrequency", type: "string", required: false }
      ];
    case "Budgets":
      return [
        { name: "amount", type: "number", required: true },
        { name: "categoryName", type: "string", required: true }
      ];
    case "Holding Snapshots":
      return [
        { name: "balance", type: "number", required: true },
        { name: "holdingName", type: "string", required: true },
        { name: "holdingCategoryName", type: "string", required: true },
        { name: "holdingType", type: "string", required: true },
        { name: "date", type: "string", required: true },
        { name: "holdingInstitution", type: "string", required: false }
      ];
    case "Holdings":
      return [
        { name: "name", type: "string", required: true },
        { name: "type", type: "string", required: true },
        { name: "holdingCategoryName", type: "string", required: true },
        { name: "institution", type: "string", required: false }
      ];
    case "CashFlow Categories":
      return [
        { name: "name", type: "string", required: true },
        { name: "categoryType", type: "string", required: true }
      ];
    case "Holding Categories":
      return [
        { name: "name", type: "string", required: true }
      ];
    default:
      return [];
  }
}