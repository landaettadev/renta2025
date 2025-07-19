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
    }
} 