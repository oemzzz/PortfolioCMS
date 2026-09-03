using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;
using Riok.Mapperly.Abstractions;

namespace PortfolioCMS.Service.Mapping // <-- Burası API'nin aradığı yerdir
{
    [Mapper]
    public partial class ProjectMapper
    {
        public partial ProjectDto ToDto(Project project);
        public partial Project ToEntity(ProjectDto projectDto);
        public partial IEnumerable<ProjectDto> ToDtoList(IEnumerable<Project> projects);
    }
}