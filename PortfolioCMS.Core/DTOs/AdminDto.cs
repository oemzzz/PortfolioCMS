namespace PortfolioCMS.Core.DTOs
{
    public class AdminDto
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        // DİKKAT: PasswordHash alanı bilerek buraya eklenmedi. Angular'a asla dönmeyecek.
    }
}