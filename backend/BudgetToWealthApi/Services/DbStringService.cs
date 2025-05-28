public static class DbStringService
{
    public static string ConvertPostgresUrlToConnectionString(string url)
    {
        if (url.StartsWith("postgresql://"))
            url = url.Substring("postgresql://".Length);
        else if (url.StartsWith("postgres://"))
            url = url.Substring("postgres://".Length);

        int atIndex = url.IndexOf('@');
        if (atIndex == -1)
            throw new FormatException("Connection string format is not valid. Missing '@' separator.");

        string credentialsPart = url.Substring(0, atIndex);
        string hostPart = url.Substring(atIndex + 1);

        int colonIndex = credentialsPart.IndexOf(':');
        string username = colonIndex > 0 ? credentialsPart.Substring(0, colonIndex) : credentialsPart;
        string password = colonIndex > 0 ? credentialsPart.Substring(colonIndex + 1) : "";

        int slashIndex = hostPart.IndexOf('/');
        string host = slashIndex > 0 ? hostPart.Substring(0, slashIndex) : hostPart;
        string database = slashIndex > 0 ? hostPart.Substring(slashIndex + 1) : "";

        int portIndex = host.IndexOf(':');
        string portStr = "5432";
        if (portIndex > 0)
        {
            portStr = host.Substring(portIndex + 1);
            host = host.Substring(0, portIndex);
        }

        return $"Host={host};" +
              $"Port={portStr};" +
              $"Database={database};" +
              $"Username={username};" +
              $"Password={password};" +
              $"SSL Mode=Require;" +
              $"Trust Server Certificate=true;";
    }
}