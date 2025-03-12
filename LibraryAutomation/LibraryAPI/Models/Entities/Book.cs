using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryAPI.Models.Entities
{
    [Table("books")]
    public class Book
    {
        [Key]
        public Guid book_id { get; set; }

        [Required]
        public string name { get; set; }

        public string? image_url { get; set; }

        [Required]
        public int stock { get; set; }

        [Required]
        public Guid category_id { get; set; }

        [Required]
        public Guid author_id { get; set; }

        [JsonIgnore]
        public Category Category { get; set; }

        [JsonIgnore]
        public Author Author { get; set; }

        [JsonIgnore]
        public virtual List<UserBorrowedBook> Borrowers { get; set; } = new List<UserBorrowedBook>();
    }
}
