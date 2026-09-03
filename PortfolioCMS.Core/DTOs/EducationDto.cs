using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Core.DTOs
{
    public class EducationDto : IValidatableObject
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public required string SchoolNameTr { get; set; }
        [Required, MaxLength(200)]
        public required string SchoolNameEn { get; set; }
        [Required, MaxLength(200)]
        public required string DepartmentTr { get; set; }
        [Required, MaxLength(200)]
        public required string DepartmentEn { get; set; }
        [MaxLength(5000)]
        public string? DescriptionTr { get; set; }
        [MaxLength(5000)]
        public string? DescriptionEn { get; set; }
        [Range(1900, 2100)]
        public int StartYear { get; set; }
        [Range(1900, 2100)]
        public int? EndYear { get; set; }
        public bool IsExchange { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (EndYear.HasValue && EndYear.Value < StartYear)
            {
                yield return new ValidationResult(
                    "EndYear, StartYear değerinden küçük olamaz.",
                    [nameof(EndYear), nameof(StartYear)]);
            }
        }
    }
}