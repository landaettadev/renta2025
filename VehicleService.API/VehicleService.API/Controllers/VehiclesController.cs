using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using System;
using System.Threading.Tasks;
using VehicleService.API.Application;

namespace VehicleService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;
        private readonly ILogger<VehiclesController> _logger;

        public VehiclesController(IVehicleService vehicleService, ILogger<VehiclesController> logger)
        {
            _vehicleService = vehicleService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterVehicle([FromBody] VehicleDto vehicleDto)
        {
            try
            {
                var vehicleId = await _vehicleService.RegisterVehicleAsync(vehicleDto);
                return Ok(new { VehicleId = vehicleId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar vehículo");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableVehicles([FromQuery] string type, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var vehicles = await _vehicleService.GetAvailableVehiclesAsync(type, startDate, endDate);
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar disponibilidad");
                return BadRequest(ex.Message);
            }
        }
    }
} 