 using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryAPI.Models.Entities
{
    public class User
    {

        public Guid id { get; set; }
        public string? name { get; set;}

        public string? email { get; set; }

        public string? password { get; set; }

        [JsonIgnore]
        public virtual List<UserBorrowedBook> BorrowedBooks { get; set; } = new List<UserBorrowedBook>();
    }
}
