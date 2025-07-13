using Hangfire.Dashboard;
using System.Security.Claims;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();
        
        if (httpContext == null)
            return false;

        if (!httpContext.User.Identity?.IsAuthenticated ?? true)
            return false;

        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return false;

        var allowedUserIdsEnv = Environment.GetEnvironmentVariable("HANGFIRE_ALLOWED_USER_IDS");
        if (string.IsNullOrEmpty(allowedUserIdsEnv))
            return false;

        var allowedUserIds = allowedUserIdsEnv.Split(';', StringSplitOptions.RemoveEmptyEntries)
            .Select(id => id.Trim())
            .ToArray();

        return allowedUserIds.Contains(userId);
    }
} 