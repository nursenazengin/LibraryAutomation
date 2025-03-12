using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.Entities
{
    public class UserBorrowedBook
    {

        [Key]
        public Guid borrowed_id { get; set; }  

        [Required]
        public Guid user_id { get; set; }
        public User User { get; set; }

        [Required]
        public Guid book_id { get; set; }
        public Book Book { get; set; }

        public DateTime? borrowed_at { get; set; } = DateTime.UtcNow;
        public DateTime? returned_at { get; set; }

        [Required]
        public DateTime? due_date { get; set; }
    }
}
