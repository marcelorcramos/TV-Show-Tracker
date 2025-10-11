using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TV Show Tracker API", Version = "v1" });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    jwtSecret = "your-super-secret-key-at-least-32-characters-long-for-development";
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "TvShowTrackerAPI",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "TvShowTrackerClient",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// Application Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITvShowService, TvShowService>();
builder.Services.AddScoped<IActorService, ActorService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<ICacheService, FakeCacheService>();
builder.Services.AddScoped<IGdprService, GdprService>();
builder.Services.AddScoped<IExportService, ExportService>();

// Data Seed Service - ADICIONAR ESTA LINHA
builder.Services.AddScoped<DataSeedService>();

// Background Services
builder.Services.AddHostedService<EmailBackgroundService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(TvShowTracker.Application.Mappings.MappingProfile));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173", 
            "http://localhost:5174",
            "https://localhost:3000",
            "https://localhost:5173",
            "https://localhost:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS DEVE VIR ANTES de Authentication e Authorization
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ✅ INICIALIZAÇÃO DO BANCO DE DADOS - ADICIONAR ESTA PARTE
try
{
    Console.WriteLine("🚀 Iniciando aplicação...");
    using var scope = app.Services.CreateScope();
    var seedService = scope.ServiceProvider.GetRequiredService<DataSeedService>();
    Console.WriteLine("📥 Executando seed do banco de dados...");
    await seedService.InitializeDatabaseAsync();
    Console.WriteLine("✅ Seed concluído com sucesso!");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Erro durante o seed: {ex.Message}");
    Console.WriteLine($"❌ StackTrace: {ex.StackTrace}");
}

app.Run();