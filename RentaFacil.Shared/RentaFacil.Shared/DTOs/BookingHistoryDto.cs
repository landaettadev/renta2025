using System;

namespace RentaFacil.Shared.DTOs
{
    public class BookingHistoryDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public DateTime ProcessedDate { get; set; }
        public string ReportDetails { get; set; } = string.Empty;
    }
} 