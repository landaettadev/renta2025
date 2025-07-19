using System;

namespace RentaFacil.Shared.Entities
{
    public class BookingHistory
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public DateTime ProcessedDate { get; set; }
        public string ReportDetails { get; set; } = string.Empty;
    }
} 