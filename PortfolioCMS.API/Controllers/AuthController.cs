using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PortfolioCMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _environment;

        public AuthController(
            IConfiguration configuration,
            IAuthService authService,
            IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _authService = authService;
            _environment = environment;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Veritabanından gerçek doğrulama
            var admin = await _authService.ValidateUserAsync(loginDto.Username, loginDto.Password);
            
            if (admin == null)
            {
                return Unauthorized(new { Message = "Kullanıcı adı veya şifre hatalı!" });
            }

            var tokenString = GenerateJwtToken(admin.Username);
            return Ok(new { Token = tokenString });
        }

        [HttpPost("setup")]
        public async Task<IActionResult> SetupInitialAdmin([FromBody] LoginDto loginDto)
        {
            if (!_environment.IsDevelopment())
            {
                return NotFound();
            }

            var admin = await _authService.CreateFirstAdminAsync(loginDto.Username, loginDto.Password);
            
            if (admin == null)
                return BadRequest("Sistemde zaten bir admin mevcut!");

            return Ok("Admin başarıyla oluşturuldu. Artık Login olabilirsiniz.");
        }

        private string GenerateJwtToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}