namespace PortfolioCMS.Core.Entities
{
    public class Project : BaseEntity
    {
        public required string TitleTr { get; set; }
        public required string TitleEn { get; set; }
        public required string DescriptionTr { get; set; }
        public required string DescriptionEn { get; set; }
        public required string Category { get; set; } 
        public required string TechStack { get; set; } 
        
        // Nullable (Boş geçilebilir) alanlar
        public string? GithubUrl { get; set; }
        public string? LiveUrl { get; set; } 
        public string? ImageUrl { get; set; } 
        
        public int Year { get; set; }
        public bool IsActive { get; set; } = true; 
    }
}