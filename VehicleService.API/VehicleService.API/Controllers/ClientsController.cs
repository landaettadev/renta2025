using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentaFacil.Shared.Entities;
using RentaFacil.Shared.DTOs;

namespace VehicleService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly VehicleDbContext _context;
        public ClientsController(VehicleDbContext context)
        {
            _context = context;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] ClientUpdateDto dto)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null) return NotFound();
            client.Phone = dto.Phone;
            client.Ciudad = dto.Ciudad;
            client.Direccion = dto.Direccion;
            await _context.SaveChangesAsync();
            return Ok(client);
        }
    }
} 