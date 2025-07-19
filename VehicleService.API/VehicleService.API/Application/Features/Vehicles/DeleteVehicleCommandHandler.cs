using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class DeleteVehicleCommandHandler : IRequestHandler<DeleteVehicleCommand, bool>
    {
        private readonly VehicleDbContext _context;
        public DeleteVehicleCommandHandler(VehicleDbContext context)
        {
            _context = context;
        }
        public async Task<bool> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = await _context.Vehicles.FindAsync(new object[] { request.Id }, cancellationToken);
            if (vehicle == null)
                return false;
            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
} 