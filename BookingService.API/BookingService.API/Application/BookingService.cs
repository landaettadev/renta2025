using BookingService.API.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using RentaFacil.Shared.DTOs;

namespace BookingService.API.Application
{
    public class BookingService : IBookingService
    {
        private readonly BookingDbContext _context;
        private readonly ILogger<BookingService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public BookingService(BookingDbContext context, ILogger<BookingService> logger, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
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
                Estado = RentaFacil.Shared.EstadoReserva.Pendiente
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
                Estado = b.Estado,
                Status = b.Estado == RentaFacil.Shared.EstadoReserva.Pendiente ? "Pending" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Confirmada ? "Confirmed" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Cancelada ? "Cancelled" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Completada ? "Completed" : ""
            }).ToList();
        }

        public async Task<bool> CancelBookingAsync(int bookingId, int userId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null || booking.ClientId != userId) return false;
            booking.Estado = RentaFacil.Shared.EstadoReserva.Cancelada;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Reserva {bookingId} cancelada por usuario {userId}");
            return true;
        }

        public async Task<List<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings.OrderByDescending(b => b.CreatedAt).ToListAsync();
            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                VehicleId = b.VehicleId,
                ClientId = b.ClientId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Estado = b.Estado,
                Status = b.Estado == RentaFacil.Shared.EstadoReserva.Pendiente ? "Pending" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Confirmada ? "Confirmed" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Cancelada ? "Cancelled" :
                        b.Estado == RentaFacil.Shared.EstadoReserva.Completada ? "Completed" : ""
            }).ToList();
        }

        public async Task<bool> UpdateBookingAsync(int id, BookingDto bookingDto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return false;
            booking.StartDate = bookingDto.StartDate;
            booking.EndDate = bookingDto.EndDate;
            // Mapear status string a Estado (entero)
            if (!string.IsNullOrEmpty(bookingDto.Status))
            {
                switch (bookingDto.Status)
                {
                    case "Pending": booking.Estado = RentaFacil.Shared.EstadoReserva.Pendiente; break;
                    case "Confirmed": booking.Estado = RentaFacil.Shared.EstadoReserva.Confirmada; break;
                    case "Cancelled": booking.Estado = RentaFacil.Shared.EstadoReserva.Cancelada; break;
                    case "Completed": booking.Estado = RentaFacil.Shared.EstadoReserva.Completada; break;
                }
            }
            else
            {
                booking.Estado = bookingDto.Estado;
            }
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Reserva {id} actualizada");
            return true;
        }

        public async Task<List<BookingDetailDto>> GetBookingHistoryWithVehicleDetailsAsync(int clientId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.ClientId == clientId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            var client = _httpClientFactory.CreateClient("VehicleService");
            var result = new List<BookingDetailDto>();
            foreach (var b in bookings)
            {
                try
                {
                    var response = await client.GetAsync($"api/vehicles/{b.VehicleId}");
                    response.EnsureSuccessStatusCode();
                    var json = await response.Content.ReadAsStringAsync();
                    var vehicle = JsonSerializer.Deserialize<VehicleDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    result.Add(new BookingDetailDto
                    {
                        Id = b.Id,
                        VehicleId = b.VehicleId,
                        ClientId = b.ClientId,
                        StartDate = b.StartDate,
                        EndDate = b.EndDate,
                        Status = b.Estado.ToString(),
                        Estado = b.Estado,
                        VehicleBrand = vehicle?.Brand ?? string.Empty,
                        VehicleModel = vehicle?.Model ?? string.Empty,
                        VehicleType = vehicle?.Type ?? string.Empty,
                        VehicleLicensePlate = vehicle?.LicensePlate ?? string.Empty,
                        VehicleImage = vehicle?.Image,
                        VehiclePricePerDay = 0 // Si tienes este dato, asígnalo aquí
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error obteniendo detalles del vehículo {b.VehicleId}");
                }
            }
            return result;
        }
    }
} 