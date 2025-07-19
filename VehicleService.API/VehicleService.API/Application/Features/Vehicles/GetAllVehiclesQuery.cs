using MediatR;
using RentaFacil.Shared.DTOs;
using System.Collections.Generic;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class GetAllVehiclesQuery : IRequest<IEnumerable<VehicleDto>>
    {
    }
} 