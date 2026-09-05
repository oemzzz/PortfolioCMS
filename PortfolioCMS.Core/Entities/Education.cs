namespace PortfolioCMS.Core.Entities
{
    public class Education : BaseEntity
    {
        public required string SchoolNameTr { get; set; }
        public required string SchoolNameEn { get; set; }
        public required string DepartmentTr { get; set; }
        public required string DepartmentEn { get; set; }
        public string? DescriptionTr { get; set; }
        public string? DescriptionEn { get; set; }
        public int?StartYear { get; set; }
        public int? EndYear { get; set; }
        public bool IsExchange { get; set; }
    }
}