namespace PortfolioCMS.Core.DTOs
{
    public class AcademicPaperDto
    {
        public int Id { get; set; }
        public required string TitleTr { get; set; }
        public required string TitleEn { get; set; }
        public required string AbstractTr { get; set; }
        public required string AbstractEn { get; set; }
        public string? DoiNumber { get; set; }
        public string? JournalName { get; set; } 
        public required string Status { get; set; } 
        public string? CoAuthors { get; set; } 
        public DateTime? PublishedDate { get; set; } 
    }
}