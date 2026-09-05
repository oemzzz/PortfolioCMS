using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;
using PortfolioCMS.Core.Services;
using PortfolioCMS.Service.Mapping;
using Microsoft.AspNetCore.Authorization;

namespace PortfolioCMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IService<Project> _service;
        private readonly ProjectMapper _mapper; 

        public ProjectsController(IService<Project> service, ProjectMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _service.GetAllAsync();
            var projectsDto = _mapper.ToDtoList(projects); 
            return Ok(projectsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _service.GetByIdAsync(id);
            if (project == null) return NotFound();

            var projectDto = _mapper.ToDto(project); 
            return Ok(projectDto);
        }
        [Authorize] // Bu endpoint'e erişim için yetkilendirme gereklidir
        [HttpPost]
        public async Task<IActionResult> Add(ProjectDto projectDto)
        {
            var project = _mapper.ToEntity(projectDto); 
            await _service.AddAsync(project);

            var newProjectDto = _mapper.ToDto(project);
            return CreatedAtAction(nameof(GetById), new { id = newProjectDto.Id }, newProjectDto);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProjectDto projectDto)
        {
        if (id != projectDto.Id)
        return BadRequest("Geçersiz işlem: URL ve veri ID'leri uyuşmuyor.");

         var exists = await _service.AnyAsync(x => x.Id == id);
         if (!exists) return NotFound();

         var project = _mapper.ToEntity(projectDto);
         await _service.UpdateAsync(project);
         return NoContent();
}

        [Authorize] // Bu endpoint'e erişim için yetkilendirme gereklidir
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var project = await _service.GetByIdAsync(id);
            if (project == null) return NotFound();

            await _service.RemoveAsync(project);
            return NoContent();
        }
    }
}