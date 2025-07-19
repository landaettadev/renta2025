using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.Entities;

namespace BookingService.API
{
    public class BookingDbContext : DbContext
    {
        public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<BookingHistory> BookingHistories { get; set; }
    }
} 