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
    public class SkillsController : ControllerBase
    {
        private readonly IService<Skill> _service;
        private readonly SkillMapper _mapper;

        public SkillsController(IService<Skill> service, SkillMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var skills = await _service.GetAllAsync();
            var skillsDto = _mapper.ToDtoList(skills);
            return Ok(skillsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var skill = await _service.GetByIdAsync(id);
            if (skill == null) return NotFound();

            var skillDto = _mapper.ToDto(skill);
            return Ok(skillDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add(SkillDto skillDto)
        {
            var skill = _mapper.ToEntity(skillDto);
            await _service.AddAsync(skill);

            var newSkillDto = _mapper.ToDto(skill);
            return CreatedAtAction(nameof(GetById), new { id = newSkillDto.Id }, newSkillDto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SkillDto skillDto)
        {
            if (id != skillDto.Id)
            {
                return BadRequest("Geçersiz işlem: URL ve veri ID'leri uyuşmuyor.");
            }

            var existingSkill = await _service.GetByIdAsync(id);
            if (existingSkill == null) return NotFound();

            var skill = _mapper.ToEntity(skillDto);
            await _service.UpdateAsync(skill);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var skill = await _service.GetByIdAsync(id);
            if (skill == null) return NotFound();

            await _service.RemoveAsync(skill);
            return NoContent();
        }
    }
}