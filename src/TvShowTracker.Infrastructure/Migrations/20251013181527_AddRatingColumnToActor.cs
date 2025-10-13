using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvShowTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingColumnToActor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "Actors",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Actors");
        }
    }
}
