using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using VehicleService.API;
using VehicleService.API.Application;
using Xunit;

public class VehicleServiceServiceTests
{
    [Fact]
    public async Task PuedeRegistrarYConsultarVehiculo()
    {
        var options = new DbContextOptionsBuilder<VehicleDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new VehicleDbContext(options);
        var logger = Mock.Of<ILogger<VehicleService.API.Application.VehicleService>>();
        var service = new VehicleService.API.Application.VehicleService(context, logger);
        context.Vehicles.Add(new Vehicle
        {
            LicensePlate = "ABC123",
            Brand = "Toyota",
            Model = "Corolla",
            Type = "Sedan",
            IsAvailable = true,
            Image = null
        });
        context.SaveChanges();
        var vehicles = await service.GetAllVehiclesAsync();
        Assert.Single(vehicles);
        Assert.Equal("Toyota", vehicles[0].Brand);
    }

    [Fact]
    public async Task PuedeEliminarVehiculo()
    {
        var options = new DbContextOptionsBuilder<VehicleDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new VehicleDbContext(options);
        var logger = Mock.Of<ILogger<VehicleService.API.Application.VehicleService>>();
        var service = new VehicleService.API.Application.VehicleService(context, logger);
        var veh = new Vehicle { LicensePlate = "XYZ789", Brand = "Mazda", Model = "3", Type = "Hatchback", IsAvailable = true };
        context.Vehicles.Add(veh);
        context.SaveChanges();
        var ok = await service.DeleteVehicleAsync(veh.Id);
        Assert.True(ok);
        Assert.Empty(context.Vehicles);
    }

    [Fact]
    public async Task PuedeActualizarVehiculo()
    {
        var options = new DbContextOptionsBuilder<VehicleDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new VehicleDbContext(options);
        var logger = Mock.Of<ILogger<VehicleService.API.Application.VehicleService>>();
        var service = new VehicleService.API.Application.VehicleService(context, logger);
        var veh = new Vehicle { LicensePlate = "DEF456", Brand = "Chevrolet", Model = "Onix", Type = "Sedan", IsAvailable = true };
        context.Vehicles.Add(veh);
        context.SaveChanges();
        var dto = new VehicleDto { Id = veh.Id, LicensePlate = "DEF456", Brand = "Chevrolet", Model = "Onix Plus", Type = "Sedan", IsAvailable = false, Image = null };
        var ok = await service.UpdateVehicleAsync(veh.Id, dto);
        Assert.True(ok);
        var updated = await context.Vehicles.FindAsync(veh.Id);
        Assert.Equal("Onix Plus", updated.Model);
        Assert.False(updated.IsAvailable);
    }
} 