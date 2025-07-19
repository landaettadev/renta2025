using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VehicleService.API.Application
{
    public class VehicleService : IVehicleService
    {
        private readonly VehicleDbContext _context;
        private readonly ILogger<VehicleService> _logger;

        public VehicleService(VehicleDbContext context, ILogger<VehicleService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> RegisterVehicleAsync(VehicleDto vehicleDto)
        {
            var vehicle = new Vehicle
            {
                LicensePlate = vehicleDto.LicensePlate,
                Brand = vehicleDto.Brand,
                Model = vehicleDto.Model,
                Type = vehicleDto.Type,
                IsAvailable = true
            };
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Vehículo registrado: {vehicle.Id}");
            return vehicle.Id;
        }

        public async Task<List<VehicleDto>> GetAvailableVehiclesAsync(string type, DateTime startDate, DateTime endDate)
        {
            // Consulta básica de disponibilidad (puede mejorarse con lógica de reservas)
            var vehicles = await _context.Vehicles
                .Where(v => v.Type == type && v.IsAvailable)
                .ToListAsync();
            return vehicles.Select(v => new VehicleDto
            {
                Id = v.Id,
                LicensePlate = v.LicensePlate,
                Brand = v.Brand,
                Model = v.Model,
                Type = v.Type,
                IsAvailable = v.IsAvailable
            }).ToList();
        }
    }
} 