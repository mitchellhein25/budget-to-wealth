public class NetWorthTrendGraph
{
    public List<NetWorthTrendGraphEntry> Entries { get; set; } = new List<NetWorthTrendGraphEntry>();
}

public class NetWorthTrendGraphEntry
{
    public DateOnly Date { get; set; }
    public long AssetValueInCents { get; set; }
    public long DebtValueInCents { get; set; }
    public long NetWorthInCents { get; set; }
}