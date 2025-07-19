using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RentaFacil.Shared.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RentaFacil.Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _serviceProvider;

        public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<WorkerDbContext>();
                        var today = DateTime.UtcNow.Date;
                        var bookings = db.Bookings
                            .Where(b => b.CreatedAt.Date == today)
                            .ToList();

                        if (bookings.Any())
                        {
                            var report = new BookingHistory
                            {
                                ProcessedDate = DateTime.UtcNow,
                                ReportDetails = $"Reservas procesadas: {bookings.Count} - IDs: {string.Join(",", bookings.Select(b => b.Id))}",
                                BookingId = bookings.First().Id // Solo como ejemplo, puedes ajustar la lógica
                            };
                            db.BookingHistories.Add(report);
                            await db.SaveChangesAsync(stoppingToken);
                            _logger.LogInformation($"Reporte guardado: {report.ReportDetails}");
                        }
                        else
                        {
                            _logger.LogInformation("No hay reservas para procesar hoy.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error procesando reservas del día");
                }
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Ejecuta cada hora
            }
        }
    }
}
