using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BookingService.API; // Para BookingDbContext
using BookingService.API.Application; // Para BookingService
using RentaFacil.Shared; // Para EstadoReserva
using RentaFacil.Shared.Entities; // Para Booking
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using RentaFacil.Shared.DTOs;
using Xunit;

public class BookingServiceServiceTests
{
    [Fact]
    public async Task NoPermiteReservasSolapadas()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new BookingDbContext(options);
        context.Bookings.Add(new Booking
        {
            VehicleId = 1,
            ClientId = 1,
            StartDate = new DateTime(2025, 7, 20),
            EndDate = new DateTime(2025, 7, 25),
            Estado = EstadoReserva.Confirmada
        });
        context.SaveChanges();
        var logger = Mock.Of<ILogger<BookingService.API.Application.BookingService>>();
        var httpFactory = Mock.Of<IHttpClientFactory>();
        var service = new BookingService.API.Application.BookingService(context, logger, httpFactory);
        var nuevaReserva = new BookingDto
        {
            VehicleId = 1,
            ClientId = 2,
            StartDate = new DateTime(2025, 7, 22), // Se cruza con la existente
            EndDate = new DateTime(2025, 7, 24)
        };
        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => service.CreateBookingAsync(nuevaReserva));
        Assert.Contains("ya está reservado", ex.Message);
    }

    [Fact]
    public async Task PermiteCrearReservaValida()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new BookingDbContext(options);
        var logger = Mock.Of<ILogger<BookingService.API.Application.BookingService>>();
        var httpFactory = Mock.Of<IHttpClientFactory>();
        var service = new BookingService.API.Application.BookingService(context, logger, httpFactory);
        var reserva = new BookingDto
        {
            VehicleId = 2,
            ClientId = 3,
            StartDate = new DateTime(2025, 8, 1),
            EndDate = new DateTime(2025, 8, 5)
        };
        // Act
        var id = await service.CreateBookingAsync(reserva);
        // Assert
        Assert.True(id > 0);
        Assert.Single(context.Bookings);
    }

    [Fact]
    public async Task NoPermiteReservaConFechasInvalidas()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new BookingDbContext(options);
        var logger = Mock.Of<ILogger<BookingService.API.Application.BookingService>>();
        var httpFactory = Mock.Of<IHttpClientFactory>();
        var service = new BookingService.API.Application.BookingService(context, logger, httpFactory);
        var reserva = new BookingDto
        {
            VehicleId = 2,
            ClientId = 3,
            StartDate = new DateTime(2025, 8, 10),
            EndDate = new DateTime(2025, 8, 5)
        };
        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => service.CreateBookingAsync(reserva));
        Assert.Contains("inicio debe ser menor", ex.Message);
    }

    [Fact]
    public async Task ConsultarHistorialPorClienteDevuelveReservasCorrectas()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new BookingDbContext(options);
        context.Bookings.Add(new Booking
        {
            VehicleId = 1,
            ClientId = 99,
            StartDate = new DateTime(2025, 7, 1),
            EndDate = new DateTime(2025, 7, 2),
            Estado = EstadoReserva.Confirmada
        });
        context.Bookings.Add(new Booking
        {
            VehicleId = 2,
            ClientId = 99,
            StartDate = new DateTime(2025, 7, 3),
            EndDate = new DateTime(2025, 7, 4),
            Estado = EstadoReserva.Pendiente
        });
        context.Bookings.Add(new Booking
        {
            VehicleId = 3,
            ClientId = 100,
            StartDate = new DateTime(2025, 7, 5),
            EndDate = new DateTime(2025, 7, 6),
            Estado = EstadoReserva.Confirmada
        });
        context.SaveChanges();
        var logger = Mock.Of<ILogger<BookingService.API.Application.BookingService>>();
        var httpFactory = Mock.Of<IHttpClientFactory>();
        var service = new BookingService.API.Application.BookingService(context, logger, httpFactory);
        // Act
        var historial = await service.GetBookingHistoryByClientAsync(99);
        // Assert
        Assert.Equal(2, historial.Count);
        Assert.All(historial, h => Assert.Equal(99, h.ClientId));
    }
} 