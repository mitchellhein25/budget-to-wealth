public class CashFlowTrendGraph
{
    public List<CashFlowTrendGraphEntry> Entries { get; set; } = new List<CashFlowTrendGraphEntry>();
}

public class CashFlowTrendGraphEntry
{
    public DateOnly Date { get; set; }
    public long IncomeInCents { get; set; }
    public long ExpensesInCents { get; set; }
    public long NetCashFlowInCents { get; set; }
}