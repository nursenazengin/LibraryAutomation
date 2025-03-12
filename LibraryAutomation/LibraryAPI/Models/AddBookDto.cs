using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using LibraryAPI.Models.Entities;

namespace LibraryAPI.Models
{
    public class AddBookDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("name")]
        public string? name { get; set; }

        public Guid author_id { get; set; }

        public int stock { get; set; }

        public IFormFile? image_url { get; set; }

        [Column("category_id")]
        public Guid category_id { get; set; }

        public string? Detail { get; }

    }
}
