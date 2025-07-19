using MediatR;
using RentaFacil.Shared.DTOs;
using System;
using System.Collections.Generic;

namespace VehicleService.API.Application.Features.Vehicles
{
    public class GetAvailableVehiclesQuery : IRequest<IEnumerable<VehicleDto>>
    {
        public string? Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public GetAvailableVehiclesQuery(string? type, DateTime? startDate, DateTime? endDate)
        {
            Type = type;
            StartDate = startDate;
            EndDate = endDate;
        }
    }
} 