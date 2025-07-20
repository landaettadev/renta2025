namespace RentaFacil.Shared.Entities
{
    public class Client
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; } // Relación con Usuario
        public string FirstName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
    }
} 