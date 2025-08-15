using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetToWealthApi.Migrations
{
    /// <inheritdoc />
    public partial class InvestmentReturnsandManualInvestmentCategoriestables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ManualInvestmentCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualInvestmentCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvestmentReturns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    StartHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: true),
                    EndHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: true),
                    ManualInvestmentCategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    ManualInvestmentReturnDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ManualInvestmentPercentageReturn = table.Column<decimal>(type: "numeric", nullable: true),
                    ManualInvestmentRecurrenceFrequency = table.Column<int>(type: "integer", nullable: true),
                    ManualInvestmentRecurrenceEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TotalContributions = table.Column<long>(type: "bigint", nullable: false),
                    TotalWithdrawals = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestmentReturns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestmentReturns_HoldingSnapshots_EndHoldingSnapshotId",
                        column: x => x.EndHoldingSnapshotId,
                        principalTable: "HoldingSnapshots",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InvestmentReturns_HoldingSnapshots_StartHoldingSnapshotId",
                        column: x => x.StartHoldingSnapshotId,
                        principalTable: "HoldingSnapshots",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InvestmentReturns_ManualInvestmentCategories_ManualInvestme~",
                        column: x => x.ManualInvestmentCategoryId,
                        principalTable: "ManualInvestmentCategories",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentReturns_EndHoldingSnapshotId",
                table: "InvestmentReturns",
                column: "EndHoldingSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentReturns_ManualInvestmentCategoryId",
                table: "InvestmentReturns",
                column: "ManualInvestmentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentReturns_StartHoldingSnapshotId",
                table: "InvestmentReturns",
                column: "StartHoldingSnapshotId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvestmentReturns");

            migrationBuilder.DropTable(
                name: "ManualInvestmentCategories");
        }
    }
}
