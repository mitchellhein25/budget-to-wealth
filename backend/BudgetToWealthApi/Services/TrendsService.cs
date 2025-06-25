using Microsoft.EntityFrameworkCore;

namespace BudgetToWealthApi.Services;

internal class TrendsService<TEntry>
{
    internal TrendGraph GenerateTrendsGraph(
        List<TEntry> allEntries,
        Func<TEntry, DateOnly> getDate,
        Func<TEntry, Guid> getId,
        Func<TEntry?, long?> getValue,
        Func<TEntry, bool> isPositiveValue,
        Func<TEntry, bool> isNegativeValue,
        DateOnly? startDate,
        DateOnly? endDate,
        IntervalType? interval)
    {
        DateOnly effectiveStartDate = startDate ?? allEntries.Min(getDate);
        DateOnly effectiveEndDate = endDate ?? allEntries.Max(getDate);

        Dictionary<Guid, long> categoryBalances = InitializeEntriesBeforeStartDate(allEntries, getId, getDate, getValue, effectiveStartDate);

        TrendGraph trendGraph = CreateTrendGraph(allEntries, getDate, getId, getValue, isPositiveValue, isNegativeValue, effectiveStartDate, effectiveEndDate, categoryBalances);

        if (interval == null)
            interval = CalculateInterval(trendGraph);

        trendGraph.Entries = FilterEntriesByInterval(trendGraph.Entries, interval.Value);

        if (trendGraph.Entries.Count > 100)
            trendGraph.Entries = trendGraph.Entries.Take(100).ToList();

        return trendGraph;
    }

    private Dictionary<Guid, long> InitializeEntriesBeforeStartDate(List<TEntry> allEntries, Func<TEntry, Guid> getId, Func<TEntry, DateOnly> getDate, Func<TEntry?, long?> getValue, DateOnly startDate)
    {
        Dictionary<Guid, long> categoryBalances = new Dictionary<Guid, long>();

        IEnumerable<Guid> userCategoryIds = allEntries.Select(getId).Distinct();
        foreach (Guid categoryId in userCategoryIds)
        {
            TEntry? lastSnapshot = allEntries
                .Where(s => getId(s) == categoryId && getDate(s) < startDate)
                .OrderByDescending(s => getDate(s))
                .FirstOrDefault();
            categoryBalances[categoryId] = getValue(lastSnapshot) ?? 0;
        }
        return categoryBalances;
    }

    private TrendGraph CreateTrendGraph(
        List<TEntry> allEntries, 
        Func<TEntry, DateOnly> getDate, 
        Func<TEntry, Guid> getId, 
        Func<TEntry?, long?> getValue, 
        Func<TEntry, bool> isPositiveValue, 
        Func<TEntry, bool> isNegativeValue, 
        DateOnly effectiveStartDate, 
        DateOnly effectiveEndDate, 
        Dictionary<Guid, long> categoryBalances)
    {
        TrendGraph dashboard = new TrendGraph();
        TrendGraphEntry? previousEntry = null;

        for (DateOnly date = effectiveStartDate; date <= effectiveEndDate; date = date.AddDays(1))
        {
            TrendGraphEntry entry = new TrendGraphEntry();
            entry.Date = date;

            List<TEntry> entriesForDate = allEntries.Where(s => getDate(s) == date).ToList();
            foreach (TEntry? entryForDate in entriesForDate)
                categoryBalances[getId(entryForDate)] = getValue(entryForDate) ?? 0;

            List<Guid> userCategories = allEntries.Select(s => getId(s)).Distinct().ToList();

            long positiveValue = entriesForDate
                .Where(isPositiveValue)
                .Sum(c => getValue(c) ?? 0);

            long negativeValue = entriesForDate
                .Where(isNegativeValue)
                .Sum(c => getValue(c) ?? 0);

            if (!entriesForDate.Any() && previousEntry != null)
            {
                positiveValue = previousEntry.PositiveValue;
                negativeValue = previousEntry.NegativeValue;
            }

            entry.PositiveValue = positiveValue;
            entry.NegativeValue = negativeValue;
            entry.NetValue = entry.PositiveValue - entry.NegativeValue;
            dashboard.Entries.Add(entry);
            
            previousEntry = entry;
        }
        return dashboard;
    }

    private IntervalType CalculateInterval(TrendGraph dashboard)
    {
        if (dashboard.Entries.Count > 365 * 2)
            return IntervalType.Yearly;
        if (dashboard.Entries.Count > 30 * 2)
            return IntervalType.Monthly;
        return IntervalType.Daily;
    }

    private List<TrendGraphEntry> FilterEntriesByInterval(List<TrendGraphEntry> entries, IntervalType interval)
    {
        return interval switch
        {
            IntervalType.Daily => entries,
            IntervalType.Monthly => entries.Where(e => e.Date.Day == 1).ToList(),
            IntervalType.Yearly => entries.Where(e => e.Date.Day == 1 && e.Date.Month == 1).ToList(),
            _ => entries
        };
    }
}