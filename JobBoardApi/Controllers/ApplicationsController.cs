using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobBoardApi.Data;
using JobBoardApi.Models;

namespace JobBoardApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] Application application)
        {
            // Prevent duplicate applications
            var exists = await _context.Applications.AnyAsync(a => a.UserId == application.UserId && a.JobId == application.JobId);
            if (exists)
                return BadRequest("Already applied to this job.");
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return Ok(application);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplicationsForUser(int userId)
        {
            return await _context.Applications.Include(a => a.Job).Where(a => a.UserId == userId).ToListAsync();
        }

        [HttpGet("job/{jobId}")]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplicationsForJob(int jobId)
        {
            return await _context.Applications.Include(a => a.User).Where(a => a.JobId == jobId).ToListAsync();
        }
    }
} 