using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Core.DTOs
{
    public class SkillDto
    {
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public required string Name { get; set; }
    }
}