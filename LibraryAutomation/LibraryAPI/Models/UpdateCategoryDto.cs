using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using LibraryAPI.Models.Entities;

namespace LibraryAPI.Models
{
    public class UpdateCategoryDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("name")]
        public string? name { get; set; }
    }
}
