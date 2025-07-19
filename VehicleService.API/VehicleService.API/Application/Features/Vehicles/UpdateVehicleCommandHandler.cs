using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, bool>
    {
        private readonly VehicleDbContext _context;
        public UpdateVehicleCommandHandler(VehicleDbContext context)
        {
            _context = context;
        }
        public async Task<bool> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = await _context.Vehicles.FindAsync(new object[] { request.Id }, cancellationToken);
            if (vehicle == null)
                return false;
            vehicle.LicensePlate = request.LicensePlate;
            vehicle.Brand = request.Brand;
            vehicle.Model = request.Model;
            vehicle.Type = request.Type;
            vehicle.IsAvailable = request.IsAvailable;
            vehicle.Image = request.Image;
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 