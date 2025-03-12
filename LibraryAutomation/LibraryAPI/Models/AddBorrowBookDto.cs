using LibraryAPI.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public class AddBorrowBookDto
    {


        [Required]
        public Guid user_id { get; set; }

        [Required]
        public Guid book_id { get; set; }

        public DateTime borrowed_at { get; set; } = DateTime.UtcNow;

        public DateTime? due_date { get; set; }

    }
}
