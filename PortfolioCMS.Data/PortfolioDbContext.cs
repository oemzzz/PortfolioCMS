using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Core.Entities;

namespace PortfolioCMS.Data
{
    public class PortfolioDbContext : DbContext
    {
        // Dependency Injection ile API katmanından (appsettings.json veya User Secrets) bağlantı dizesini (Connection String) almak için yapıcı metot (Constructor)
        public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
        {
        }

        // Veritabanında oluşacak tablolar
        public DbSet<Project> Projects { get; set; }
        public DbSet<AcademicPaper> AcademicPapers { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Education> Educations { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Fluent API: Varlıkların veritabanındaki kısıtlamalarını (kolon uzunlukları vb.) belirliyoruz.
            // Core katmanını temiz tutmak adına Data Annotations ([Required], [MaxLength] vb.) kullanmıyoruz.
            
            modelBuilder.Entity<Admin>()
                .Property(x => x.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Project>()
                .Property(x => x.TitleTr)
                .IsRequired()
                .HasMaxLength(200);

            base.OnModelCreating(modelBuilder);
        }
    }
}