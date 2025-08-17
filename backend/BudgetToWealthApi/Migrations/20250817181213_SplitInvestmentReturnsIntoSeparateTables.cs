using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetToWealthApi.Migrations
{
    /// <inheritdoc />
    public partial class SplitInvestmentReturnsIntoSeparateTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvestmentReturns");

            migrationBuilder.CreateTable(
                name: "HoldingInvestmentReturns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    StartHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: false),
                    EndHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: false),
                    TotalContributions = table.Column<long>(type: "BIGINT", nullable: false),
                    TotalWithdrawals = table.Column<long>(type: "BIGINT", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoldingInvestmentReturns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HoldingInvestmentReturns_HoldingSnapshots_EndHoldingSnapsho~",
                        column: x => x.EndHoldingSnapshotId,
                        principalTable: "HoldingSnapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HoldingInvestmentReturns_HoldingSnapshots_StartHoldingSnaps~",
                        column: x => x.StartHoldingSnapshotId,
                        principalTable: "HoldingSnapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManualInvestmentReturns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    ManualInvestmentCategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ManualInvestmentReturnDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ManualInvestmentPercentageReturn = table.Column<decimal>(type: "numeric", nullable: false),
                    ManualInvestmentRecurrenceFrequency = table.Column<int>(type: "integer", nullable: true),
                    ManualInvestmentRecurrenceEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualInvestmentReturns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManualInvestmentReturns_ManualInvestmentCategories_ManualIn~",
                        column: x => x.ManualInvestmentCategoryId,
                        principalTable: "ManualInvestmentCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HoldingInvestmentReturns_EndHoldingSnapshotId",
                table: "HoldingInvestmentReturns",
                column: "EndHoldingSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_HoldingInvestmentReturns_StartHoldingSnapshotId",
                table: "HoldingInvestmentReturns",
                column: "StartHoldingSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_ManualInvestmentReturns_ManualInvestmentCategoryId",
                table: "ManualInvestmentReturns",
                column: "ManualInvestmentCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HoldingInvestmentReturns");

            migrationBuilder.DropTable(
                name: "ManualInvestmentReturns");

            migrationBuilder.CreateTable(
                name: "InvestmentReturns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    EndHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: true),
                    ManualInvestmentCategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    StartHoldingSnapshotId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ManualInvestmentPercentageReturn = table.Column<decimal>(type: "numeric", nullable: true),
                    ManualInvestmentRecurrenceEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ManualInvestmentRecurrenceFrequency = table.Column<int>(type: "integer", nullable: true),
                    ManualInvestmentReturnDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TotalContributions = table.Column<long>(type: "BIGINT", nullable: false),
                    TotalWithdrawals = table.Column<long>(type: "BIGINT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
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
    }
}
