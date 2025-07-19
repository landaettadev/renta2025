using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.Entities;

namespace VehicleService.API
{
    public class VehicleDbContext : DbContext
    {
        public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }
    }
} 