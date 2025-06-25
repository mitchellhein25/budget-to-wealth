public class TrendGraph
{
    public List<TrendGraphEntry> Entries { get; set; } = new List<TrendGraphEntry>();
}

public class TrendGraphEntry
{
    public DateOnly Date { get; set; }
    public long PositiveValue { get; set; }
    public long NegativeValue { get; set; }
    public long NetValue { get; set; }
}