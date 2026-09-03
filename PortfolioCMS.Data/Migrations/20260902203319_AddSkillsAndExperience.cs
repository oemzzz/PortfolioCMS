using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioCMS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSkillsAndExperience : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Proficiency",
                table: "Skills");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "Proficiency",
                table: "Skills",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
