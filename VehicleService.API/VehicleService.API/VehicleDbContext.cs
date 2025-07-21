using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.Entities;

namespace VehicleService.API
{
    public class VehicleDbContext : DbContext
    {
        public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<RentaFacil.Shared.Entities.Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.LicensePlate)
                .IsUnique();
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.LicensePlate)
                .IsRequired()
                .HasMaxLength(20);
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.Type)
                .IsRequired()
                .HasMaxLength(20);
            base.OnModelCreating(modelBuilder);
        }
    }
} 