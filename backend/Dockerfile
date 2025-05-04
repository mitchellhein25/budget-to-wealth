# Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
ENV ASPNETCORE_ENVIRONMENT=Development
WORKDIR /app
EXPOSE 80

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /backend

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -o out

# Publish the project and output to /app/publish
RUN dotnet publish BudgetToWealthApi/BudgetToWealthApi.csproj -c Release -o /app/publish

# Debug step: List the contents of /app/publish to check the output
RUN ls -al /app/publish

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BudgetToWealthApi.dll", "--urls", "http://0.0.0.0:80"]
