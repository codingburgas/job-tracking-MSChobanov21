using JobBoardApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=jobboard.db"));

// Add CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());
});

// Add JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Seed a sample user if none exists
    if (!db.Users.Any())
    {
        db.Users.Add(new JobBoardApi.Models.User
        {
            Name = "Sample User",
            Email = "sample@jobs.bg",
            Password = Convert.ToBase64String(System.Security.Cryptography.SHA256.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes("password"))),
            Role = "User"
        });
        db.SaveChanges();
    }
    var user = db.Users.First();

    // Seed 10 sample jobs if less than 10 exist
    if (db.Jobs.Count() < 10)
    {
        var jobs = new[]
        {
            new JobBoardApi.Models.Job { Title = "Frontend Developer", Description = "Build modern web apps with Angular.", Company = "Webify", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "Backend Developer", Description = "Work on scalable APIs with .NET.", Company = "APISoft", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "QA Engineer", Description = "Test and ensure software quality.", Company = "QualityFirst", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "DevOps Engineer", Description = "Automate deployments and CI/CD.", Company = "CloudOps", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "UI/UX Designer", Description = "Design beautiful and usable interfaces.", Company = "DesignPro", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "Product Manager", Description = "Lead product development teams.", Company = "ProdLead", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "Data Scientist", Description = "Analyze data and build ML models.", Company = "DataWiz", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "Mobile Developer", Description = "Create mobile apps for iOS/Android.", Company = "AppMakers", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "System Administrator", Description = "Maintain IT infrastructure.", Company = "InfraTech", UserId = user.Id },
            new JobBoardApi.Models.Job { Title = "Support Specialist", Description = "Help customers solve issues.", Company = "HelpDesk", UserId = user.Id }
        };
        db.Jobs.AddRange(jobs);
        db.SaveChanges();
    }
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
