using MediatR;
using RentaFacil.Shared.DTOs;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class CreateVehicleCommand : IRequest<VehicleDto>
    {
        public string LicensePlate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string? Image { get; set; }
    }
} 