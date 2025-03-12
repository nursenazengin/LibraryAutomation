using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryAPI.Models.Entities
{

    [System.ComponentModel.DataAnnotations.Schema.Table("authors")]

    public class Author
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        
        [Column("author_id")]
        public Guid author_id { get; set; }

        [Column("name")]
        public string? name { get; set; }

        [JsonIgnore]
        public virtual List<Book> Books { get; set; }
    }
}
