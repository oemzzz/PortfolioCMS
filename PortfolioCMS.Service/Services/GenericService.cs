using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Core.Repositories;
using PortfolioCMS.Core.Services;
using PortfolioCMS.Data;
using System.Linq.Expressions;

namespace PortfolioCMS.Service.Services
{
    public class GenericService<T> : IService<T> where T : class
    {
        private readonly IGenericRepository<T> _repository;
        private readonly PortfolioDbContext _context;

        // Dependency Injection ile Repository ve DbContext'i alıyoruz
        public GenericService(IGenericRepository<T> repository, PortfolioDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> expression)
        {
            return _repository.Where(expression);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression)
        {
            return await _repository.AnyAsync(expression);
        }

        public async Task<T> AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
            await _context.SaveChangesAsync(); // Unit of Work: İşlemi veritabanına kalıcı olarak yaz
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {
            _repository.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(T entity)
        {
            _repository.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}