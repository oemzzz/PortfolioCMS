namespace PortfolioCMS.Core.Entities
{
    public class Skill : BaseEntity
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
    }
}