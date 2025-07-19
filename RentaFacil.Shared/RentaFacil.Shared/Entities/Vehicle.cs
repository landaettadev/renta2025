namespace RentaFacil.Shared.Entities
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Ej: Sedan, SUV, etc.
        public bool IsAvailable { get; set; } = true;
        public string? Image { get; set; }
    }
} 