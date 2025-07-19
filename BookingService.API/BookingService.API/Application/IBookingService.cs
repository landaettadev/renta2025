using RentaFacil.Shared.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingService.API.Application
{
    public interface IBookingService
    {
        Task<int> CreateBookingAsync(BookingDto bookingDto);
        Task<bool> AssignClientAsync(int bookingId, int clientId);
        Task<List<BookingDto>> GetBookingHistoryByClientAsync(int clientId);
    }
} 