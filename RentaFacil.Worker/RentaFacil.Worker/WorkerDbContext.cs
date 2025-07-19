using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.Entities;

namespace RentaFacil.Worker
{
    public class WorkerDbContext : DbContext
    {
        public WorkerDbContext(DbContextOptions<WorkerDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingHistory> BookingHistories { get; set; }
    }
} 