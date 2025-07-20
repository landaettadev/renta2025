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
using MediatR;
using VehicleService.API.Application.Features.Vehicles;

namespace VehicleService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<VehiclesController> _logger;
        private readonly IConfiguration _configuration;

        public VehiclesController(IMediator mediator, ILogger<VehiclesController> logger, IConfiguration configuration)
        {
            _mediator = mediator;
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
                    _logger.LogError($"[DEBUG SAS] ContainerUrl: {containerUrl}");
                    _logger.LogError($"[DEBUG SAS] SasToken (completo): {sasToken}");
                    _logger.LogError($"[DEBUG SAS] Blob URI (completa): {blobUri}");
                    var blobClient = new BlockBlobClient(new Uri(blobUri));
                    using (var stream = imageFile.OpenReadStream())
                    {
                        await blobClient.UploadAsync(stream);
                    }
                    vehicleDto.Image = $"{containerUrl}/{blobName}";
                }
                var command = new CreateVehicleCommand
                {
                    LicensePlate = vehicleDto.LicensePlate,
                    Brand = vehicleDto.Brand,
                    Model = vehicleDto.Model,
                    Type = vehicleDto.Type,
                    IsAvailable = vehicleDto.IsAvailable,
                    Image = vehicleDto.Image
                };
                var created = await _mediator.Send(command);
                return Ok(new { VehicleId = created.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError($"[DEBUG SAS] Exception: {ex.Message}");
                _logger.LogError(ex, "Error al registrar vehículo");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableVehicles([FromQuery] string? type, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = new GetAvailableVehiclesQuery(type, startDate, endDate);
                var vehicles = await _mediator.Send(query);
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
            var vehicles = await _mediator.Send(new GetAllVehiclesQuery());
            return Ok(vehicles);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleDto vehicleDto)
        {
            try
            {
                var command = new UpdateVehicleCommand
                {
                    Id = id,
                    LicensePlate = vehicleDto.LicensePlate,
                    Brand = vehicleDto.Brand,
                    Model = vehicleDto.Model,
                    Type = vehicleDto.Type,
                    IsAvailable = vehicleDto.IsAvailable,
                    Image = vehicleDto.Image
                };
                var updated = await _mediator.Send(command);
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
                var command = new DeleteVehicleCommand { Id = id };
                var vehicle = await _mediator.Send(command);
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