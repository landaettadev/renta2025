using MediatR;
using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.DTOs;
using VehicleService.API.Application.Features.Vehicles;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class GetAvailableVehiclesQueryHandler : IRequestHandler<GetAvailableVehiclesQuery, IEnumerable<VehicleDto>>
    {
        private readonly VehicleDbContext _context;
        public GetAvailableVehiclesQueryHandler(VehicleDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<VehicleDto>> Handle(GetAvailableVehiclesQuery request, CancellationToken cancellationToken)
        {
            var vehiclesQuery = _context.Vehicles.AsQueryable();
            if (!string.IsNullOrEmpty(request.Type) && request.Type != "Todos")
            {
                vehiclesQuery = vehiclesQuery.Where(v => v.Type == request.Type);
            }
            vehiclesQuery = vehiclesQuery.Where(v => v.IsAvailable);
            bool fechasValidas = request.StartDate.HasValue && request.EndDate.HasValue && request.StartDate.Value < request.EndDate.Value;
            if (!fechasValidas)
            {
                var vehicles = await vehiclesQuery.ToListAsync(cancellationToken);
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
            var reservasActivas = _context.Bookings.Where(b => b.Estado == RentaFacil.Shared.EstadoReserva.Pendiente || b.Estado == RentaFacil.Shared.EstadoReserva.Confirmada);
            var vehiculosOcupados = reservasActivas
                .Where(b => (request.StartDate.Value < b.EndDate && request.EndDate.Value > b.StartDate))
                .Select(b => b.VehicleId);
            var disponibles = await vehiclesQuery
                .Where(v => !vehiculosOcupados.Contains(v.Id))
                .ToListAsync(cancellationToken);
            return disponibles.Select(v => new VehicleDto
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