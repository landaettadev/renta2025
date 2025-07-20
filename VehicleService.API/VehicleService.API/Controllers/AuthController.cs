using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RentaFacil.Shared.DTOs;
using RentaFacil.Shared.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace VehicleService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly VehicleDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(VehicleDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsuarioRegistroDto dto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("El email ya está registrado.");

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = "Usuario"
            };
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Crear el registro en Client con los datos personales
            var client = new Client
            {
                UsuarioId = usuario.Id,
                FirstName = dto.Nombre, // O puedes separar en dto.FirstName si lo tienes
                Email = dto.Email,
                Phone = dto.Celular ?? "",
                Ciudad = dto.Ciudad ?? "",
                Direccion = dto.Direccion ?? ""
            };
            _context.Set<Client>().Add(client);
            await _context.SaveChangesAsync();

            return Ok(new { usuario.Id, usuario.Nombre, usuario.Email, usuario.Rol, clientId = client.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
                return Unauthorized("Credenciales inválidas.");

            // Buscar datos personales en Client
            var client = await _context.Set<Client>().FirstOrDefaultAsync(c => c.UsuarioId == usuario.Id);

            var token = GenerarJwt(usuario);
            return Ok(new {
                token,
                usuario = new {
                    usuario.Id,
                    usuario.Nombre,
                    usuario.Email,
                    usuario.Rol,
                    clientId = client?.Id,
                    datosPersonales = client != null ? new {
                        client.FirstName,
                        client.Email,
                        client.Phone,
                        client.Ciudad,
                        client.Direccion
                    } : null
                }
            });
        }

        [HttpGet("all")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new { u.Id, u.Nombre, u.Email, u.Rol })
                .ToListAsync();
            return Ok(usuarios);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UsuarioRegistroDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();
            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Password))
                usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            usuario.Rol = dto.Rol ?? usuario.Rol;
            await _context.SaveChangesAsync();
            return Ok(new { usuario.Id, usuario.Nombre, usuario.Email, usuario.Rol });
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, usuario.PasswordHash))
                return BadRequest("La contraseña actual es incorrecta.");
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Contraseña actualizada correctamente." });
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private string GenerarJwt(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim("nombre", usuario.Nombre)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 