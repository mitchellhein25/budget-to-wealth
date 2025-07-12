using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetToWealthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddInstitutionsPropToHoldings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Institution",
                table: "Holdings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Institution",
                table: "Holdings");
        }
    }
}
