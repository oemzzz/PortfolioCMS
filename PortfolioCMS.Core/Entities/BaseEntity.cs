namespace PortfolioCMS.Core.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        // Veritabanına kayıt atıldığı anki zamanı Evrensel Saat (UTC) olarak alır.
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}