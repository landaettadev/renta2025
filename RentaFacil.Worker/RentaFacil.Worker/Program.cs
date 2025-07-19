using Microsoft.EntityFrameworkCore;
using RentaFacil.Worker;

namespace RentaFacil.Worker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();
                    services.AddDbContext<WorkerDbContext>((serviceProvider, options) =>
                    {
                        var configuration = serviceProvider.GetRequiredService<IConfiguration>();
                        var connectionString = configuration.GetConnectionString("DefaultConnection");
                        options.UseSqlServer(connectionString, sqlOptions => 
                        {
                            sqlOptions.EnableRetryOnFailure();
                            sqlOptions.MigrationsAssembly("RentaFacil.Worker");
                        });
                    });
                })
                .Build();

            host.Run();
        }
    }
}