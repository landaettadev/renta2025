using RentaFacil.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VehicleService.API.Application
{
    public interface IVehicleService
    {
        Task<int> RegisterVehicleAsync(VehicleDto vehicleDto);
        Task<List<VehicleDto>> GetAvailableVehiclesAsync(string type, DateTime startDate, DateTime endDate);
        Task<List<VehicleDto>> GetAllVehiclesAsync();
        Task<bool> DeleteVehicleAsync(int id);
        Task<bool> UpdateVehicleAsync(int id, VehicleDto vehicleDto);
    }
} 