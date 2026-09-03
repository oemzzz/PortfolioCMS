using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;
using Riok.Mapperly.Abstractions;

namespace PortfolioCMS.Service.Mapping
{
    [Mapper]
    public partial class EducationMapper
    {
        public partial EducationDto ToDto(Education education);
        public partial Education ToEntity(EducationDto educationDto);
        public partial IEnumerable<EducationDto> ToDtoList(IEnumerable<Education> educations);
    }
}