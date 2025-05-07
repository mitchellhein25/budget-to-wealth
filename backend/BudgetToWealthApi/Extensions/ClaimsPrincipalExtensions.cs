using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    public static string? GetUserId(this ClaimsPrincipal user) => user.FindFirst("sub")?.Value;
}
