using MediatR;
using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class GetAllVehiclesQueryHandler : IRequestHandler<GetAllVehiclesQuery, IEnumerable<VehicleDto>>
    {
        private readonly VehicleDbContext _context;
        public GetAllVehiclesQueryHandler(VehicleDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<VehicleDto>> Handle(GetAllVehiclesQuery request, CancellationToken cancellationToken)
        {
            var vehicles = await _context.Vehicles.ToListAsync(cancellationToken);
            return vehicles.Select(v => new VehicleDto
            {
                Id = v.Id,
                LicensePlate = v.LicensePlate,
                Brand = v.Brand,
                Model = v.Model,
                Type = v.Type,
                IsAvailable = v.IsAvailable,
                Image = v.Image
            });
        }
    }
} 