# Investment Returns Tracking Feature - Design Document

## Overview

This document outlines the design for adding investment return tracking capabilities to the existing holdings management system. The feature will allow users to track performance of both market-based investments (linked to existing Holdings) and non-market investments (personal loans, CDs, etc.) over monthly periods.

## Goals

- Track investment returns for both market and non-market investments
- Provide a simple monthly data entry workflow
- Calculate return rates and net returns automatically  
- Maintain data integrity through validation
- Support various investment types beyond traditional holdings

## Current System Architecture

### Existing Models
```csharp
public enum HoldingType { Asset, Debt }

public class HoldingCategory : BaseEntity
{
    public required string Name { get; set; }
    public string? UserId { get; set; }
    public bool IsDefault => UserId == null;
}

public class Holding : BaseEntity
{
    public required string Name { get; set; }
    public required HoldingType Type { get; set; }
    public required Guid HoldingCategoryId { get; set; }
    public HoldingCategory? HoldingCategory { get; set; }
    public string? Institution { get; set; }
    public string? UserId { get; set; }
}

public class HoldingSnapshot : BaseEntity
{
    public required Guid HoldingId { get; set; }
    public Holding? Holding { get; set; }
    public required DateOnly Date { get; set; }
    public required long Balance { get; set; }
    public string? UserId { get; set; }
}
```

## New Data Model

### InvestmentReturn Entity
```csharp
public class InvestmentReturn : BaseEntity
{
    // Core tracking data
    public required DateOnly StartDate { get; set; }
    public required DateOnly EndDate { get; set; }
    public required long StartingBalance { get; set; }
    public required long EndingBalance { get; set; }
    public required long NetContributions { get; set; } // contributions - withdrawals
    
    // For market investments (links to existing Holdings)
    public Guid? HoldingId { get; set; }
    public Holding? Holding { get; set; }
    
    // For non-market investments
    public string? InvestmentName { get; set; }
    public decimal? FixedRate { get; set; }
    public string? CounterpartyName { get; set; } // Who you lent to/borrowed from
    public string? InvestmentType { get; set; } // "Personal Loan", "CD", "Bond", etc.
    public DateOnly? MaturityDate { get; set; } // When loan/investment matures
    public string? PaymentFrequency { get; set; } // "Monthly", "Quarterly", "At Maturity"
    public bool IsCompounding { get; set; } // Whether interest compounds
    
    public string? Notes { get; set; }
    public string? UserId { get; set; }
    
    // Calculated properties
    public long NetReturn => EndingBalance - StartingBalance - NetContributions;
    public decimal ReturnRate => StartingBalance > 0 ? 
        (decimal)NetReturn / StartingBalance : 0m;
    
    // Helper properties
    public bool IsMarketInvestment => HoldingId.HasValue;
    public bool IsNonMarketInvestment => !string.IsNullOrEmpty(InvestmentName);
    public bool IsValid => IsMarketInvestment ^ IsNonMarketInvestment;
}
```

### Optional: Investment Type Enum
```csharp
public enum NonMarketInvestmentType
{
    PersonalLoan,
    CertificateOfDeposit,
    Bond,
    PrivateEquity,
    RealEstate,
    Other
}
```

## Database Considerations

### Indexing Strategy
- Index on `(UserId, HoldingId, StartDate)` for market investments
- Index on `(UserId, InvestmentName, StartDate)` for non-market investments
- Index on `(UserId, StartDate, EndDate)` for date range queries

### Constraints
- Unique constraint on `(HoldingId, StartDate)` where `HoldingId IS NOT NULL`
- Unique constraint on `(InvestmentName, UserId, StartDate)` where `InvestmentName IS NOT NULL`
- Check constraint to ensure exactly one investment type is specified

## User Interface Design

### Monthly Entry Workflow

#### 1. Investment Selection
- Dropdown/search for existing Holdings OR
- Option to create "New Investment" for non-market investments

#### 2. Month/Year Selection
- Date picker for target month (e.g., "July 2025")
- System automatically calculates start/end dates for the month

#### 3. Data Entry Form

**For Market Investments:**
- Starting Balance: Auto-populated from previous month's ending balance
- Ending Balance: User input (required)
- Net Contributions: User input (can be negative for withdrawals)
- Notes: Optional text field

**For Non-Market Investments:**
- All above fields, plus:
- Investment Name: Text input
- Investment Type: Dropdown (Personal Loan, CD, Bond, etc.)
- Counterparty Name: Text input (optional)
- Fixed Rate: Percentage input (optional)
- Maturity Date: Date picker (optional)
- Payment Frequency: Dropdown (optional)
- Is Compounding: Checkbox

#### 4. Validation & Confirmation
- Show calculated return rate before saving
- Highlight any data inconsistencies
- Confirm if creating gaps in historical data

## Business Logic

### Data Entry Helpers
```csharp
public class InvestmentReturnService
{
    public long? GetLastMonthEndingBalance(Guid? holdingId, string? investmentName, 
        int year, int month, string userId)
    {
        // Find the previous month's record and return EndingBalance
        // This helps auto-populate the starting balance in forms
    }

    public bool HasDataForMonth(Guid? holdingId, string? investmentName, 
        int year, int month, string userId)
    {
        // Check if data already exists to prevent duplicates
    }

    public List<InvestmentReturn> GetInvestmentChain(Guid? holdingId, 
        string? investmentName, string userId)
    {
        // Get all records for an investment, ordered by date
        // Useful for validation and displaying historical performance
    }

    public bool ValidateSequence(List<InvestmentReturn> returns)
    {
        // Ensure no gaps in the chain
        // Verify ending balance of month N equals starting balance of month N+1
    }
}
```

### Date Utilities
```csharp
public static class MonthlyPeriodHelper
{
    public static (DateOnly start, DateOnly end) GetMonthRange(int year, int month)
    {
        var start = new DateOnly(year, month, 1);
        var end = start.AddMonths(1).AddDays(-1);
        return (start, end);
    }
}
```

## Reporting & Analytics

### Key Metrics to Calculate
- Monthly return rate
- Annualized return rate
- Total return over custom periods
- Performance comparison across investments
- Portfolio-level performance (combining multiple investments)

### Report Types
1. **Monthly Performance Summary**: All investments for a given month
2. **Investment Detail**: Historical performance for a single investment
3. **Portfolio Performance**: Aggregate performance across all investments
4. **Investment Type Analysis**: Compare performance by investment type

## Migration Strategy

### Phase 1: Core Infrastructure
- Create `InvestmentReturn` table
- Implement basic CRUD operations
- Build simple data entry UI

### Phase 2: Enhanced Features
- Advanced validation
- Historical data import from existing `HoldingSnapshot` data
- Basic reporting dashboard

### Phase 3: Analytics & Optimization
- Advanced analytics and charts
- Performance benchmarking
- Mobile-responsive improvements

## Data Migration

### Existing HoldingSnapshot Integration
- Consider creating a utility to pre-populate `InvestmentReturn` records from existing `HoldingSnapshot` data
- May need to infer contributions based on balance changes that don't match market performance

### Validation Rules
- Prevent overlapping periods for the same investment
- Ensure chronological ordering
- Validate that calculated returns are reasonable (flag extreme outliers)

## Testing Strategy

### Unit Tests
- Return calculation accuracy
- Date range utilities
- Validation logic
- Business rule enforcement

### Integration Tests
- Database constraints
- API endpoints
- UI workflow end-to-end

### Edge Cases
- Leap year handling
- Month boundary calculations
- Zero/negative starting balances
- Missing previous month data

## Security Considerations

- Ensure `UserId` filtering in all queries
- Validate user owns referenced Holdings
- Sanitize all text inputs
- Rate limiting for data entry APIs

## Performance Considerations

- Lazy loading for navigation properties
- Consider read replicas for reporting queries
- Cache frequently accessed calculations
- Pagination for large historical datasets

## Future Enhancements

### Potential Features
- Automatic data import from financial institutions
- Goal tracking (target return rates)
- Tax-loss harvesting insights
- Benchmark comparison (S&P 500, etc.)
- Multi-currency support
- Investment allocation recommendations

### Technical Improvements
- GraphQL API for flexible data fetching
- Real-time updates with SignalR
- Export to Excel/PDF functionality
- Mobile app support

---

## Notes

- All monetary values stored as `long` (cents) to avoid decimal precision issues
- Consider time zone handling for date calculations
- May want to add audit trail for investment return modifications
- Consider soft deletes for investment return records