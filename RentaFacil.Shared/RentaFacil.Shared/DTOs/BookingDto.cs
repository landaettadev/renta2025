using System;

namespace RentaFacil.Shared.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int ClientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
} 