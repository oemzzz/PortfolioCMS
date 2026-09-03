using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace PortfolioCMS.API.Middlewares
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            // Hatayı sunucu loglarına (konsola veya ileride dosyaya) yazdırıyoruz.
            _logger.LogError(
                exception, "Exception occurred: {Message}", exception.Message);

            // İstek gönderen tarafa (örneğin Angular'a) döneceğimiz standart hata formatını (Problem Details) hazırlıyoruz.
            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Sunucu Hatası (Internal Server Error)",
                Detail = "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz."
            };

            // Eğer JWT entegrasyonu yaptıktan sonra "Yetkisiz Erişim" gibi özel bir hata fırlatmak istersek
            // burada 'if (exception is UnauthorizedAccessException)' gibi kontroller ekleyerek
            // Status kodunu (örneğin 401 Unauthorized) ve mesajını değiştirebiliriz.

            httpContext.Response.StatusCode = problemDetails.Status.Value;

            await httpContext.Response
                .WriteAsJsonAsync(problemDetails, cancellationToken);

            return true; // "Hatayı biz yakaladık ve yönettik, başka bir yere gitmesine gerek yok" diyoruz.
        }
    }
}