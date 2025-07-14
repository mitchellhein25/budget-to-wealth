using Hangfire.Dashboard;
using Microsoft.Extensions.Configuration;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        HttpContext httpContext = context.GetHttpContext();
        
        if (httpContext == null)
            return false;

        string authHeader = httpContext.Request.Headers["Authorization"].ToString();
        
        // If no auth header, return false to trigger browser auth prompt
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
        {
            httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Hangfire Dashboard\"";
            return false;
        }

        string encodedCredentials = authHeader.Substring("Basic ".Length);
        string credentials = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
        string[] parts = credentials.Split(':');
        
        if (parts.Length != 2)
            return false;

        string username = parts[0];
        string password = parts[1];

        var config = httpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
        
        string expectedUsername = Environment.GetEnvironmentVariable("HANGFIRE_AUTH_USERNAME") ?? config?["Hangfire:AuthUsername"] ?? "admin";
        string expectedPassword = Environment.GetEnvironmentVariable("HANGFIRE_AUTH_PASSWORD") ?? config?["Hangfire:AuthPassword"] ?? "admin";

        if (string.IsNullOrEmpty(expectedUsername) || string.IsNullOrEmpty(expectedPassword))
            return false;

        return username == expectedUsername && password == expectedPassword;
    }
} 