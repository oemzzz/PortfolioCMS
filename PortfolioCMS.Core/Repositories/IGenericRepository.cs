using System.Linq.Expressions;

namespace PortfolioCMS.Core.Repositories
{
    // "where T : class" kısıtlaması, bu arayüzün sadece referans tipleri (Entity'lerimiz) ile çalışmasını garanti eder.
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        
        // IQueryable dönmesi, LINQ sorgularının hemen veritabanına gitmesini engeller (Deferred Execution). 
        // Sorguya daha sonra Service katmanında ek filtreler (.OrderBy vb.) eklenebilir.
        IQueryable<T> Where(Expression<Func<T, bool>> expression);
        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);
        
        Task AddAsync(T entity);
        
        // EF Core Change Tracking yapısında Update ve Remove işlemleri veritabanına I/O isteği atmaz.
        // Sadece bellekteki varlığın durumunu (State) "Modified" veya "Deleted" olarak işaretler.
        // Veritabanı işlemi, DbContext üzerinden SaveChangesAsync() çağrıldığında yapıldığı için bu metotların asenkron karşılığı yoktur.
        void Update(T entity);
        void Remove(T entity);
    }
}