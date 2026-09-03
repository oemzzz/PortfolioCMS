using PortfolioCMS.Core.Entities;

namespace PortfolioCMS.Core.Services
{
    public interface IAuthService
    {
        Task<Admin?> ValidateUserAsync(string username, string password);
        Task<Admin?> CreateFirstAdminAsync(string username, string password);
    }
}