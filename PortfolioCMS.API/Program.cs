using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Core.Repositories;
using PortfolioCMS.Core.Services;
using PortfolioCMS.Data;
using PortfolioCMS.Data.Repositories;
using PortfolioCMS.Service.Mapping;
using PortfolioCMS.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi; // Swagger konfigürasyonu için gerekli

var builder = WebApplication.CreateBuilder(args);

// 1. Controller Servislerinin Eklenmesi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 2. Swagger Yapılandırması (JWT Desteği ile)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PortfolioCMS API", Version = "v1" });

    // Swagger arayüzüne Token girme butonu ekler
   c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    Description = "Token'ı buraya yapıştırın (başına 'Bearer' yazmanıza gerek yok, Swagger otomatik ekler).",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT"
});

   c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
{
    [new OpenApiSecuritySchemeReference("Bearer", document)] = []
});
});

// 3. Veritabanı Yapılandırması
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? throw new InvalidOperationException("AllowedOrigins yapılandırması bulunamadı!");
builder.Services.AddDbContext<PortfolioDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// 4. Mapperly (ProjectMapper) Kaydı
builder.Services.AddScoped<ProjectMapper>();
builder.Services.AddScoped<SkillMapper>();
builder.Services.AddScoped<EducationMapper>();

// 5. Dependency Injection (IoC) Kayıtları
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped(typeof(IService<>), typeof(GenericService<>));
builder.Services.AddScoped<IAuthService, AuthService>();

// 6. CORS Yapılandırılması 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 7. Global Exception Handler
builder.Services.AddExceptionHandler<PortfolioCMS.API.Middlewares.GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); 

// 8. JWT Authentication Yapılandırması
// Değerler User Secrets'tan gelmezse (null ise) uygulama güvenli bir şekilde ayağa kalkmayı reddeder.
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey bulunamadı!");
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? throw new InvalidOperationException("JWT Issuer bulunamadı!");
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? throw new InvalidOperationException("JWT Audience bulunamadı!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
        };
    });

var app = builder.Build();

// HTTP Request Pipeline (Middleware Tüneli)
app.UseExceptionHandler(); // Hata kalkanı en başta olmalı

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

// Güvenlik Katmanları (Sıralama kritiktir)
app.UseAuthentication(); // 1. Sen kimsin? (Token doğrulama)
app.UseAuthorization();  // 2. Yetkin var mı? (Erişim kontrolü)

app.MapControllers();

app.Run();