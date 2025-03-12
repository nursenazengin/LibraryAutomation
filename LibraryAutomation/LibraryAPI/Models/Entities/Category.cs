using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryAPI.Models.Entities
{
    [System.ComponentModel.DataAnnotations.Schema.Table("books")]
    public class Category
    {

        public Guid category_id { get; set; }

        public string? name { get; set; }

        [JsonIgnore]
        public virtual List<Book> Books { get; set; }
    }
}
