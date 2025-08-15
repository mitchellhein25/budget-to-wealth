public class RecurrenceService
{
    private DateOnly _currentProcessingDate;

    public RecurrenceService()
    {
        _currentProcessingDate = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public void SetProcessingDate(DateOnly date)
    {
        _currentProcessingDate = date;
    }

    public bool ShouldCreateRecurrenceForToday(DateOnly recurrenceDate, RecurrenceFrequency recurrenceFrequency)
    {
        DateOnly today = _currentProcessingDate;
        return recurrenceFrequency switch
        {
            RecurrenceFrequency.Weekly => IsWeeklyRecurrenceDate(recurrenceDate, today),
            RecurrenceFrequency.Every2Weeks => IsEvery2WeeksRecurrenceDate(recurrenceDate, today),
            RecurrenceFrequency.Monthly => IsMonthlyRecurrenceDate(recurrenceDate, today),
            _ => false
        };
    }

    public bool IsRecurrenceActive(DateOnly? recurrenceEndDate)
    {
        return recurrenceEndDate == null || recurrenceEndDate >= _currentProcessingDate;
    }

    public bool IsRecurrenceDue(DateOnly recurrenceDate)
    {
        return recurrenceDate <= _currentProcessingDate;
    }

    private bool IsWeeklyRecurrenceDate(DateOnly recurrenceDate, DateOnly today)
    {
        int daysDifference = today.DayNumber - recurrenceDate.DayNumber;
        return daysDifference % 7 == 0 && daysDifference >= 7;
    }

    private bool IsEvery2WeeksRecurrenceDate(DateOnly recurrenceDate, DateOnly today)
    {
        int daysDifference = today.DayNumber - recurrenceDate.DayNumber;
        return daysDifference % 14 == 0 && daysDifference >= 14;
    }

    private bool IsMonthlyRecurrenceDate(DateOnly recurrenceDate, DateOnly today)
    {
        if (today < recurrenceDate)
            return false;
            
        int expectedDay = CalculateMonthlyRecurrenceDay(recurrenceDate, today);
        DateOnly expectedDate = new DateOnly(today.Year, today.Month, expectedDay);

        return today == expectedDate &&
               ((today.Year > recurrenceDate.Year) ||
                (today.Year == recurrenceDate.Year && today.Month > recurrenceDate.Month));
    }

    private int CalculateMonthlyRecurrenceDay(DateOnly recurrenceDate, DateOnly today)
    {
        int daysInCurrentMonth = DateTime.DaysInMonth(today.Year, today.Month);
        int daysInRecurrenceMonth = DateTime.DaysInMonth(recurrenceDate.Year, recurrenceDate.Month);

        if (recurrenceDate.Day == daysInRecurrenceMonth)
            return daysInCurrentMonth;

        return Math.Min(recurrenceDate.Day, daysInCurrentMonth);
    }
}
