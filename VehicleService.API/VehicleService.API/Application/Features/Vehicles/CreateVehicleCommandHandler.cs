using MediatR;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class CreateVehicleCommandHandler : IRequestHandler<CreateVehicleCommand, VehicleDto>
    {
        private readonly VehicleDbContext _context;
        public CreateVehicleCommandHandler(VehicleDbContext context)
        {
            _context = context;
        }
        public async Task<VehicleDto> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = new Vehicle
            {
                LicensePlate = request.LicensePlate,
                Brand = request.Brand,
                Model = request.Model,
                Type = request.Type,
                IsAvailable = request.IsAvailable,
                Image = request.Image
            };
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync(cancellationToken);
            return new VehicleDto
            {
                Id = vehicle.Id,
                LicensePlate = vehicle.LicensePlate,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                Type = vehicle.Type,
                IsAvailable = vehicle.IsAvailable,
                Image = vehicle.Image
            };
        }
    }
} 