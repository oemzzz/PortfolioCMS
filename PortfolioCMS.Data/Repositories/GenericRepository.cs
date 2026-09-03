using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Core.Repositories;
using System.Linq.Expressions;

namespace PortfolioCMS.Data.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly PortfolioDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(PortfolioDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            // FindAsync, birincil anahtar (Primary Key) üzerinden arama yapar.
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.AnyAsync(expression);
        }

    public async Task AddAsync(T entity)
{
    await _dbSet.AddAsync(entity);
    await _context.SaveChangesAsync(); // <-- İşte eksik olan komut!
}

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }
    }
}