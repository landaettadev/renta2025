using BookingService.API.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingService.API.Application
{
    public class BookingService : IBookingService
    {
        private readonly BookingDbContext _context;
        private readonly ILogger<BookingService> _logger;

        public BookingService(BookingDbContext context, ILogger<BookingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> CreateBookingAsync(BookingDto bookingDto)
        {
            // Validación básica
            if (bookingDto.StartDate >= bookingDto.EndDate)
                throw new ArgumentException("La fecha de inicio debe ser menor a la fecha de fin.");

            var booking = new Booking
            {
                VehicleId = bookingDto.VehicleId,
                ClientId = bookingDto.ClientId,
                StartDate = bookingDto.StartDate,
                EndDate = bookingDto.EndDate,
                Status = "Active"
            };
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Reserva creada: {booking.Id}");
            return booking.Id;
        }

        public async Task<bool> AssignClientAsync(int bookingId, int clientId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;
            booking.ClientId = clientId;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Cliente {clientId} asignado a reserva {bookingId}");
            return true;
        }

        public async Task<List<BookingDto>> GetBookingHistoryByClientAsync(int clientId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.ClientId == clientId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                VehicleId = b.VehicleId,
                ClientId = b.ClientId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Status = b.Status
            }).ToList();
        }
    }
} 