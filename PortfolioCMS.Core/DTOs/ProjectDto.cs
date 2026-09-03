using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Core.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public required string TitleTr { get; set; }
        [Required, MaxLength(200)]
        public required string TitleEn { get; set; }
        [Required, MaxLength(5000)]
        public required string DescriptionTr { get; set; }
        [Required, MaxLength(5000)]
        public required string DescriptionEn { get; set; }
        [Required, MaxLength(100)]
        public required string Category { get; set; } 
        [Required, MaxLength(500)]
        public required string TechStack { get; set; } 
        [Url, MaxLength(500)]
        public string? GithubUrl { get; set; }
        [Url, MaxLength(500)]
        public string? LiveUrl { get; set; } 
        [Url, MaxLength(500)]
        public string? ImageUrl { get; set; } 
        [Range(1900, 2100)]
        public int Year { get; set; }
    }
}