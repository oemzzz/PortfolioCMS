using PortfolioCMS.Core.DTOs;
using PortfolioCMS.Core.Entities;

namespace PortfolioCMS.Service.Mapping
{
    public static class AcademicPaperMapper
    {
        public static AcademicPaperDto ToDto(AcademicPaper paper)
        {
            return new AcademicPaperDto
            {
                Id = paper.Id,
                TitleTr = paper.TitleTr,
                TitleEn = paper.TitleEn,
                AbstractTr = paper.AbstractTr,
                AbstractEn = paper.AbstractEn,
                DoiNumber = paper.DoiNumber,
                JournalName = paper.JournalName,
                Status = paper.Status,
                CoAuthors = paper.CoAuthors,
                PublishedDate = paper.PublishedDate
            };
        }

        public static AcademicPaper ToEntity(AcademicPaperDto dto)
        {
            return new AcademicPaper
            {
                Id = dto.Id,
                TitleTr = dto.TitleTr,
                TitleEn = dto.TitleEn,
                AbstractTr = dto.AbstractTr,
                AbstractEn = dto.AbstractEn,
                DoiNumber = dto.DoiNumber,
                JournalName = dto.JournalName,
                Status = dto.Status,
                CoAuthors = dto.CoAuthors,
                PublishedDate = dto.PublishedDate
            };
        }
    }
}