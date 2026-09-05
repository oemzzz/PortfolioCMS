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
    public class EducationsController : ControllerBase
    {
        private readonly IService<Education> _service;
        private readonly EducationMapper _mapper;

        public EducationsController(IService<Education> service, EducationMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var educations = await _service.GetAllAsync();
            var educationsDto = _mapper.ToDtoList(educations);
            return Ok(educationsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var education = await _service.GetByIdAsync(id);
            if (education == null) return NotFound();

            var educationDto = _mapper.ToDto(education);
            return Ok(educationDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add(EducationDto educationDto)
        {
            var education = _mapper.ToEntity(educationDto);
            await _service.AddAsync(education);

            var newEducationDto = _mapper.ToDto(education);
            return CreatedAtAction(nameof(GetById), new { id = newEducationDto.Id }, newEducationDto);
        }

       [Authorize]
       [HttpPut("{id}")]
       public async Task<IActionResult> Update(int id, EducationDto educationDto)
       {
       if (id != educationDto.Id)
        return BadRequest("Geçersiz işlem: URL ve veri ID'leri uyuşmuyor.");

      var exists = await _service.AnyAsync(x => x.Id == id);
       if (!exists) return NotFound();

      var education = _mapper.ToEntity(educationDto);
      await _service.UpdateAsync(education);
      return NoContent();
       }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var education = await _service.GetByIdAsync(id);
            if (education == null) return NotFound();

            await _service.RemoveAsync(education);
            return NoContent();
        }
    }
}