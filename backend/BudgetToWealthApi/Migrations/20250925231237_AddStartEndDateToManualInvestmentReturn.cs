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
            migrationBuilder.RenameColumn(
                name: "ManualInvestmentReturnDate",
                table: "ManualInvestmentReturns",
                newName: "StartDate");

            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "ManualInvestmentReturns",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ManualInvestmentReturns");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "ManualInvestmentReturns",
                newName: "ManualInvestmentReturnDate");
        }
    }
}
