using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobBoardApi.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        [ForeignKey("Job")]
        public int JobId { get; set; }
        public Job Job { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
} 