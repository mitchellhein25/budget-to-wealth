using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BudgetToWealthApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateErrorsResolved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("157d1121-9c70-4016-80db-813a0cfcc6c3"));

            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("4e9f3872-7a6f-4e68-9691-8e8b58fd1c60"));

            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("f7658756-a1f4-435f-9ef3-75088d9fb608"));

            migrationBuilder.InsertData(
                table: "ExpenseCategories",
                columns: new[] { "Id", "Name", "UserId" },
                values: new object[,]
                {
                    { new Guid("3f5c7b85-2b1e-4c3f-9e5a-f1d9b22f0cd8"), "Groceries", null },
                    { new Guid("9c3b8b5e-83e2-4e30-bb25-6fba8e7c3c45"), "Utilities", null },
                    { new Guid("f2a91271-6a9a-45db-8f3c-e62cf6d972fa"), "Transportation", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("3f5c7b85-2b1e-4c3f-9e5a-f1d9b22f0cd8"));

            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("9c3b8b5e-83e2-4e30-bb25-6fba8e7c3c45"));

            migrationBuilder.DeleteData(
                table: "ExpenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("f2a91271-6a9a-45db-8f3c-e62cf6d972fa"));

            migrationBuilder.InsertData(
                table: "ExpenseCategories",
                columns: new[] { "Id", "Name", "UserId" },
                values: new object[,]
                {
                    { new Guid("157d1121-9c70-4016-80db-813a0cfcc6c3"), "Transportation", null },
                    { new Guid("4e9f3872-7a6f-4e68-9691-8e8b58fd1c60"), "Utilities", null },
                    { new Guid("f7658756-a1f4-435f-9ef3-75088d9fb608"), "Groceries", null }
                });
        }
    }
}
