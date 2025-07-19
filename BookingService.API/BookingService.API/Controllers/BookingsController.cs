using BookingService.API.Application;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using System;
using System.Threading.Tasks;

namespace BookingService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(IBookingService bookingService, ILogger<BookingsController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto bookingDto)
        {
            try
            {
                var bookingId = await _bookingService.CreateBookingAsync(bookingDto);
                return Ok(new { BookingId = bookingId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear reserva");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("assign-client")]
        public async Task<IActionResult> AssignClient([FromQuery] int bookingId, [FromQuery] int clientId)
        {
            try
            {
                var result = await _bookingService.AssignClientAsync(bookingId, clientId);
                if (!result) return NotFound("Reserva no encontrada");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al asignar cliente");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelBooking([FromBody] RentaFacil.Shared.CancelarReservaDto dto)
        {
            try
            {
                var result = await _bookingService.CancelBookingAsync(dto.ReservaId, dto.UsuarioId);
                if (!result) return NotFound("Reserva no encontrada o no autorizada");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cancelar reserva");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("history/{clientId}")]
        public async Task<IActionResult> GetBookingHistory(int clientId)
        {
            try
            {
                var history = await _bookingService.GetBookingHistoryByClientAsync(clientId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar historial");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("history/{clientId}/details")]
        public async Task<IActionResult> GetBookingHistoryWithDetails(int clientId)
        {
            try
            {
                var details = await _bookingService.GetBookingHistoryWithVehicleDetailsAsync(clientId);
                return Ok(details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar historial con detalles");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener reservas");
                return BadRequest(ex.Message);
            }
        }
    }
} 