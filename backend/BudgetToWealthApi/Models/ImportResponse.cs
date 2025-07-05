public class ImportResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int ImportedCount { get; set; }
    public int ErrorCount { get; set; }
    public List<ImportResult> Results { get; set; } = new();
} 