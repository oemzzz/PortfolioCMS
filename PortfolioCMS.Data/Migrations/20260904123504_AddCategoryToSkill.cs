using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioCMS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryToSkill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Skills",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Skills");
        }
    }
}
