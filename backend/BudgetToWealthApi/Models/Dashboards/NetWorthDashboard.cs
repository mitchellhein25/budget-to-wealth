public class NetWorthDashboard
{
    public List<NetWorthDashboardEntry> Entries { get; set; } = new List<NetWorthDashboardEntry>();
}

public class NetWorthDashboardEntry
{
    public DateOnly Date { get; set; }
    public long AssetValueInCents { get; set; }
    public long DebtValueInCents { get; set; }
    public long NetWorthInCents { get; set; }
}