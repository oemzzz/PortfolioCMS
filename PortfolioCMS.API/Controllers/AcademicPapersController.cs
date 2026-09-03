using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;
using PortfolioCMS.Core.Services;
using PortfolioCMS.Service.Mapping;

namespace PortfolioCMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicPapersController : ControllerBase
    {
        private readonly IService<AcademicPaper> _service;

        public AcademicPapersController(IService<AcademicPaper> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var papers = await _service.GetAllAsync();
            var papersDto = papers.Select(AcademicPaperMapper.ToDto);
            return Ok(papersDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add(AcademicPaperDto dto)
        {
            var paper = AcademicPaperMapper.ToEntity(dto);
            await _service.AddAsync(paper);
            return Ok(AcademicPaperMapper.ToDto(paper));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var paper = await _service.GetByIdAsync(id);
            if (paper == null) return NotFound();
            
            await _service.RemoveAsync(paper);
            return NoContent();
        }
    }
}