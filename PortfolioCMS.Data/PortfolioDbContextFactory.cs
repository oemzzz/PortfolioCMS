using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace PortfolioCMS.Data
{
    // IDesignTimeDbContextFactory: Sadece EF Core CLI araçları (Migration işlemleri) tarafından tetiklenen tasarım zamanı arayüzüdür.
    public class PortfolioDbContextFactory : IDesignTimeDbContextFactory<PortfolioDbContext>
    {
        public PortfolioDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<PortfolioDbContext>();

            var solutionDirectory = FindSolutionDirectory();
            var apiDirectory = Path.Combine(solutionDirectory.FullName, "PortfolioCMS.API");
            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiDirectory)
                .AddJsonFile("appsettings.json", optional: true)
                .AddUserSecrets(Assembly.Load("PortfolioCMS.API"), optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection bulunamadı.");

            optionsBuilder.UseSqlServer(connectionString);

            return new PortfolioDbContext(optionsBuilder.Options);
        }

        private static DirectoryInfo FindSolutionDirectory()
        {
            var directory = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (directory != null)
            {
                if (File.Exists(Path.Combine(directory.FullName, "PortfolioCMS.slnx")))
                {
                    return directory;
                }

                directory = directory.Parent;
            }

            throw new DirectoryNotFoundException("PortfolioCMS solution dizini bulunamadı.");
        }
    }
}