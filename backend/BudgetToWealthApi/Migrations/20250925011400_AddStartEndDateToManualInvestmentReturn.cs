using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetToWealthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddStartEndDateToManualInvestmentReturn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "ManualInvestmentReturns",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "ManualInvestmentReturns",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.Sql(@"
                UPDATE ""ManualInvestmentReturns""
                SET ""EndDate"" = ""ManualInvestmentReturnDate"",
                    ""StartDate"" = ""ManualInvestmentReturnDate"" - INTERVAL '1 month'
            ");

            migrationBuilder.DropColumn(
                name: "ManualInvestmentReturnDate",
                table: "ManualInvestmentReturns");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "ManualInvestmentReturnDate",
                table: "ManualInvestmentReturns",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.Sql(@"
                UPDATE ""ManualInvestmentReturns""
                SET ""ManualInvestmentReturnDate"" = ""EndDate""
            ");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "ManualInvestmentReturns");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ManualInvestmentReturns");
        }
    }
}
