using PortfolioCMS.Core.Entities;
using PortfolioCMS.Core.Repositories;
using PortfolioCMS.Core.Services;

namespace PortfolioCMS.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<Admin> _adminRepository;

        public AuthService(IGenericRepository<Admin> adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<Admin?> ValidateUserAsync(string username, string password)
{
    var admins = await _adminRepository.GetAllAsync();
    var admin = admins.FirstOrDefault(x => x.Username.ToLower() == username.ToLower());

    if (admin == null)
    {
        // EĞER BURAYA DÜŞERSE VERİ KAYDEDİLMEMİŞ DEMEKTİR
        Console.WriteLine($"\n---> TEŞHİS 1: Kullanıcı bulunamadı! Kullanıcı Adı: {username}\n");
        return null;
    }

    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash);
    
    if (!isPasswordValid)
    {
        // EĞER BURAYA DÜŞERSE VERİ KAYDEDİLMİŞ AMA HASH EKSİK/BOZUK DEMEKTİR
        Console.WriteLine($"\n---> TEŞHİS 2: Şifre eşleşmedi! Veritabanındaki Hash Uzunluğu: {admin.PasswordHash.Length} | Hash: {admin.PasswordHash}\n");
        return null;
    }

    return admin;
}

        public async Task<Admin?> CreateFirstAdminAsync(string username, string password)
        {
            var admins = await _adminRepository.GetAllAsync();
            if (admins.Any()) return null;

            var newAdmin = new Admin
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password) // Şifreyi Hash'leyerek kaydet
            };

            await _adminRepository.AddAsync(newAdmin);
            return newAdmin;
        }
    }
}