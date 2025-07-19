using RentaFacil.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VehicleService.API.Application
{
    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetAllVehiclesAsync();
        Task<bool> DeleteVehicleAsync(int id);
        Task<bool> UpdateVehicleAsync(int id, VehicleDto vehicleDto);
    }
} 