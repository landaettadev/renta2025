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
                IsAvailable = vehicleDto.IsAvailable, // Respetar valor enviado
                Image = vehicleDto.Image
            };
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Vehículo registrado: {vehicle.Id}");
            return vehicle.Id;
        }

        public async Task<List<VehicleDto>> GetAvailableVehiclesAsync(string type, DateTime? startDate, DateTime? endDate)
        {
            var vehiclesQuery = _context.Vehicles.AsQueryable();
            if (!string.IsNullOrEmpty(type) && type != "Todos")
            {
                vehiclesQuery = vehiclesQuery.Where(v => v.Type == type);
            }
            vehiclesQuery = vehiclesQuery.Where(v => v.IsAvailable);

            bool fechasValidas = startDate.HasValue && endDate.HasValue && startDate.Value < endDate.Value;
            if (!fechasValidas)
            {
                var vehicles = await vehiclesQuery.ToListAsync();
                return vehicles.Select(v => new VehicleDto
                {
                    Id = v.Id,
                    LicensePlate = v.LicensePlate,
                    Brand = v.Brand,
                    Model = v.Model,
                    Type = v.Type,
                    IsAvailable = v.IsAvailable,
                    Image = v.Image
                }).ToList();
            }

            // Si hay fechas válidas, excluir vehículos con reservas activas que se crucen
            var reservasActivas = _context.Bookings.Where(b => b.Estado == RentaFacil.Shared.EstadoReserva.Pendiente || b.Estado == RentaFacil.Shared.EstadoReserva.Confirmada);
            var vehiculosOcupados = reservasActivas
                .Where(b => (startDate.Value < b.EndDate && endDate.Value > b.StartDate))
                .Select(b => b.VehicleId);

            var disponibles = await vehiclesQuery
                .Where(v => !vehiculosOcupados.Contains(v.Id))
                .ToListAsync();

            return disponibles.Select(v => new VehicleDto
            {
                Id = v.Id,
                LicensePlate = v.LicensePlate,
                Brand = v.Brand,
                Model = v.Model,
                Type = v.Type,
                IsAvailable = v.IsAvailable,
                Image = v.Image
            }).ToList();
        }

        public async Task<List<VehicleDto>> GetAllVehiclesAsync()
        {
            var vehicles = await _context.Vehicles.ToListAsync();
            return vehicles.Select(v => new VehicleDto
            {
                Id = v.Id,
                LicensePlate = v.LicensePlate,
                Brand = v.Brand,
                Model = v.Model,
                Type = v.Type,
                IsAvailable = v.IsAvailable,
                Image = v.Image
            }).ToList();
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return false;
            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateVehicleAsync(int id, VehicleDto vehicleDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return false;
            vehicle.LicensePlate = vehicleDto.LicensePlate;
            vehicle.Brand = vehicleDto.Brand;
            vehicle.Model = vehicleDto.Model;
            vehicle.Type = vehicleDto.Type;
            vehicle.IsAvailable = vehicleDto.IsAvailable;
            vehicle.Image = vehicleDto.Image;
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 