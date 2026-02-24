using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Sepetza.Data.Context;
using Sepetza.Data.UnitOfWork;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Seed;
using Sepetza.Business.Services;
using Microsoft.Extensions.Logging;
using Sepetza.Core.Constants;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Entity Framework - SQLite
builder.Services.AddDbContext<SepetzaDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Memory Cache
builder.Services.AddMemoryCache();

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Business Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment(); // Production'da HTTPS zorunlu
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Development: Daha esnek ayarlar
            policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Production: Sıkı güvenlik
            var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? 
                                new[] { "https://sepetza.com" };
            policy.WithOrigins(allowedOrigins)
                  .WithHeaders("Content-Type", "Authorization", "Accept", "X-Requested-With")
                  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .AllowCredentials();
        }
    });
});

// Rate Limiting - Güvenlik için aktif (.NET 9 syntax)
builder.Services.AddRateLimiter(options =>
{
    // Auth endpoint'leri için sıkı limit
    options.AddFixedWindowLimiter("AuthPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = RateLimitConstants.AUTH_PERMIT_LIMIT;
        limiterOptions.Window = TimeSpan.FromMinutes(RateLimitConstants.WINDOW_MINUTES);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = RateLimitConstants.AUTH_QUEUE_LIMIT;
    });
    
    // Genel API endpoint'leri için
    options.AddFixedWindowLimiter("GeneralPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = RateLimitConstants.GENERAL_PERMIT_LIMIT;
        limiterOptions.Window = TimeSpan.FromMinutes(RateLimitConstants.WINDOW_MINUTES);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = RateLimitConstants.GENERAL_QUEUE_LIMIT;
    });
    
    // Sepet işlemleri için orta seviye limit
    options.AddFixedWindowLimiter("CartPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = RateLimitConstants.CART_PERMIT_LIMIT;
        limiterOptions.Window = TimeSpan.FromMinutes(RateLimitConstants.WINDOW_MINUTES);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = RateLimitConstants.CART_QUEUE_LIMIT;
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// **Render dynamic port ayarı**
var port = Environment.GetEnvironmentVariable("PORT") ?? "5205";
builder.WebHost.UseUrls($"http://*:{port}");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); // Production'da HTTPS zorunlu
}

// Security Headers
app.Use(async (context, next) =>
{
    // Security headers - indexer kullanarak duplicate key hatalarını önle
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    
    if (!app.Environment.IsDevelopment())
    {
        context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    }
    
    await next();
});

app.UseCors("AllowReactApp");

// Static files middleware for uploaded images
app.UseStaticFiles();

app.UseRateLimiter(); // Güvenlik için aktif

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SepetzaDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Database ensuring created...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Starting data seeding...");
        await DataSeeder.SeedAsync(context);
        logger.LogInformation("Data seeding completed!");

        // Seeding sonrası istatistik
        var productCount = context.Products.Count();
        var categoryCount = context.Categories.Count();
        logger.LogInformation("Products: {ProductCount}, Categories: {CategoryCount}", productCount, categoryCount);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during seeding");
    }
    finally
    {
        logger.LogInformation("Database seeding process completed");
    }
    
    logger.LogInformation("API is starting...");
}

app.Run();
