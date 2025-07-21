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

        public async Task<List<VehicleDto>> GetAvailableVehiclesAsync()
        {
            var vehicles = await _context.Vehicles.Where(v => v.IsAvailable).ToListAsync();
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