using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvShowTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDurationToTvShow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "TvShows",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "TvShows");
        }
    }
}
