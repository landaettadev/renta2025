using System;

namespace RentaFacil.Shared.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int ClientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public EstadoReserva Estado { get; set; } = EstadoReserva.Pendiente;
    }
} 