using MediatR;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class DeleteVehicleCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
} 