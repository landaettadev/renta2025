namespace RentaFacil.Shared
{
    public enum EstadoReserva
    {
        Pendiente,
        Confirmada,
        Cancelada
    }

    public class CancelarReservaDto
    {
        public int ReservaId { get; set; }
        public int UsuarioId { get; set; }
    }
}
