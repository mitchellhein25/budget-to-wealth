public class RecurrenceServiceTests
{
    private readonly RecurrenceService _service;

    public RecurrenceServiceTests()
    {
        _service = new RecurrenceService();
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_WeeklyRecurrence_ReturnsTrue()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)), RecurrenceFrequency.Weekly);
        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_WeeklyRecurrenceNotDue_ReturnsFalse()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-6)), RecurrenceFrequency.Weekly);
        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_Every2WeeksRecurrence_ReturnsTrue()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-14)), RecurrenceFrequency.Every2Weeks);
        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_Every2WeeksRecurrenceNotDue_ReturnsFalse()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-13)), RecurrenceFrequency.Every2Weeks);
        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrence_ReturnsTrue()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1)), RecurrenceFrequency.Monthly);
        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceNotDue_ReturnsFalse()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1).AddDays(-1)), RecurrenceFrequency.Monthly);
        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceLastDayOfMonth_LongerMonth_HandlesCorrectly()
    {
        _service.SetProcessingDate(DateOnly.Parse("2023-05-31"));
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.Parse("2023-04-30"), RecurrenceFrequency.Monthly);
        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceLastDayOfMonth_ShorterMonth_HandlesCorrectly()
    {
        _service.SetProcessingDate(DateOnly.Parse("2023-04-30"));
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.Parse("2023-03-31"), RecurrenceFrequency.Monthly);
        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_InvalidRecurrenceFrequency_ReturnsFalse()
    {
        bool result = _service.ShouldCreateRecurrenceForToday(DateOnly.FromDateTime(DateTime.UtcNow), (RecurrenceFrequency)999);

        Assert.False(result);
    }

    [Fact]
    public void IsRecurrenceActive_NoEndDate_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceActive(null);

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceActive_EndDateInFuture_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceActive(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceActive_EndDateToday_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceActive(DateOnly.FromDateTime(DateTime.UtcNow));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceActive_EndDateInPast_ReturnsFalse()
    {
        bool result = _service.IsRecurrenceActive(DateOnly.Parse("2023-01-14"));

        Assert.False(result);
    }

    [Fact]
    public void IsRecurrenceDue_StartDateInPast_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceDue(DateOnly.Parse("2023-01-01"));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceDue_StartDateToday_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceDue(DateOnly.FromDateTime(DateTime.UtcNow));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceDue_StartDateInFuture_ReturnsFalse()
    {
        bool result = _service.IsRecurrenceDue(DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)));

        Assert.False(result);
    }
}
