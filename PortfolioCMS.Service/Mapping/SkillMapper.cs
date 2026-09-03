using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;
using Riok.Mapperly.Abstractions;

namespace PortfolioCMS.Service.Mapping
{
    [Mapper]
    public partial class SkillMapper
    {
        public partial SkillDto ToDto(Skill skill);
        public partial Skill ToEntity(SkillDto skillDto);
        public partial IEnumerable<SkillDto> ToDtoList(IEnumerable<Skill> skills);
    }
}