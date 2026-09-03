namespace PortfolioCMS.Core.Entities
{
    public class Admin : BaseEntity
    {
        public required string Username { get; set; }
        public required string PasswordHash { get; set; } 
    }
}