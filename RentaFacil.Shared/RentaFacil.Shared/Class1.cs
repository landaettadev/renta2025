namespace RentaFacil.Shared
{
    public enum EstadoReserva
    {
        Pendiente,
        Confirmada,
        Cancelada,
        Completada
    }

    public class CancelarReservaDto
    {
        public int ReservaId { get; set; }
        public int UsuarioId { get; set; }
    }
}
