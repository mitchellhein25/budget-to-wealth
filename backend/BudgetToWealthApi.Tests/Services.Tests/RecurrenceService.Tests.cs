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
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-01");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Weekly);

        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_WeeklyRecurrenceNotDue_ReturnsFalse()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-01");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Weekly);

        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_Every2WeeksRecurrence_ReturnsTrue()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-01");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Every2Weeks);

        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_Every2WeeksRecurrenceNotDue_ReturnsFalse()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-01");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Every2Weeks);

        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrence_ReturnsTrue()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-15");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Monthly);

        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceNotDue_ReturnsFalse()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-15");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Monthly);

        Assert.False(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceLastDayOfMonth_HandlesCorrectly()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-31");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Monthly);

        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_MonthlyRecurrenceLastDayOfMonth_ShorterMonth_HandlesCorrectly()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-30");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, RecurrenceFrequency.Monthly);

        Assert.True(result);
    }

    [Fact]
    public void ShouldCreateRecurrenceForToday_InvalidRecurrenceFrequency_ReturnsFalse()
    {
        DateOnly recurrenceDate = DateOnly.Parse("2023-01-01");

        bool result = _service.ShouldCreateRecurrenceForToday(recurrenceDate, (RecurrenceFrequency)999);

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
        bool result = _service.IsRecurrenceActive(DateOnly.Parse("2023-12-31"));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceActive_EndDateToday_ReturnsTrue()
    {
        bool result = _service.IsRecurrenceActive(DateOnly.Parse("2023-01-15"));

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
        bool result = _service.IsRecurrenceDue(DateOnly.Parse("2023-01-15"));

        Assert.True(result);
    }

    [Fact]
    public void IsRecurrenceDue_StartDateInFuture_ReturnsFalse()
    {
        bool result = _service.IsRecurrenceDue(DateOnly.Parse("2023-01-16"));

        Assert.False(result);
    }

    [Fact]
    public void GetProcessingDate_ReturnsSetDate()
    {
        DateOnly expectedDate = DateOnly.Parse("2023-01-15");

        DateOnly result = _service.GetProcessingDate();

        Assert.Equal(expectedDate, result);
    }

    [Fact]
    public void SetProcessingDate_UpdatesProcessingDate()
    {
        DateOnly initialDate = DateOnly.Parse("2023-01-01");
        DateOnly newDate = DateOnly.Parse("2023-02-01");
        
        Assert.Equal(initialDate, _service.GetProcessingDate());
        
        Assert.Equal(newDate, _service.GetProcessingDate());
    }
}
