namespace PortfolioCMS.Core.Entities
{
    public class AcademicPaper : BaseEntity
    {
        public required string TitleTr { get; set; }
        public required string TitleEn { get; set; }
        public required string AbstractTr { get; set; }
        public required string AbstractEn { get; set; }
        public required string DoiNumber { get; set; }
        public required string JournalName { get; set; } 
        public required string Status { get; set; } 
        
        // Nullable (Boş geçilebilir) alanlar
        public string? CoAuthors { get; set; } 
        public DateTime? PublishedDate { get; set; } 
    }
}