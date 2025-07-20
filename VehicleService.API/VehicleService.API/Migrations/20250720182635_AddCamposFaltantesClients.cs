using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VehicleService.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCamposFaltantesClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Clients");
        }
    }
}
