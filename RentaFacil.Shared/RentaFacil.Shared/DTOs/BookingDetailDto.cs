using System;

namespace RentaFacil.Shared.DTOs
{
    public class BookingDetailDto
    {
        // Booking properties
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int ClientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public EstadoReserva Estado { get; set; }

        // Vehicle properties
        public string VehicleBrand { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;
        public string VehicleLicensePlate { get; set; } = string.Empty;
        public string? VehicleImage { get; set; }
        public decimal VehiclePricePerDay { get; set; } // Si aplica
    }
} 