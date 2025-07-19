using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using System;
using System.Threading.Tasks;
using VehicleService.API.Application;
using Microsoft.AspNetCore.Authorization;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace VehicleService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;
        private readonly ILogger<VehiclesController> _logger;
        private readonly IConfiguration _configuration;

        public VehiclesController(IVehicleService vehicleService, ILogger<VehiclesController> logger, IConfiguration configuration)
        {
            _vehicleService = vehicleService;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterVehicle([FromForm] VehicleDto vehicleDto, [FromForm] IFormFile? imageFile)
        {
            try
            {
                // Subir imagen a Azure Blob Storage si se envía
                if (imageFile != null && imageFile.Length > 0)
                {
                    var containerUrl = _configuration["AzureBlob:ContainerUrl"];
                    var sasToken = _configuration["AzureBlob:SasToken"];
                    var blobName = $"{Guid.NewGuid()}_{imageFile.FileName}";
                    var blobUri = $"{containerUrl}/{blobName}?{sasToken}";
                    _logger.LogError($"Blob URI: {blobUri}");
                    var blobClient = new BlockBlobClient(new Uri(blobUri));
                    using (var stream = imageFile.OpenReadStream())
                    {
                        await blobClient.UploadAsync(stream);
                    }
                    vehicleDto.Image = $"{containerUrl}/{blobName}";
                }
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

        [HttpGet]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _vehicleService.GetAllVehiclesAsync();
            return Ok(vehicles);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleDto vehicleDto)
        {
            try
            {
                var updated = await _vehicleService.UpdateVehicleAsync(id, vehicleDto);
                if (!updated)
                    return NotFound();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar vehículo");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            try
            {
                var vehicle = await _vehicleService.DeleteVehicleAsync(id);
                if (!vehicle)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar vehículo");
                return BadRequest(ex.Message);
            }
        }
    }
} 