namespace LibraryAPI.Models.Entities
{
    public class Login
    {
        public Guid id { get; set; }
        public string? name { get; set; }

        public string? email { get; set; }

        public string? password { get; set; }
    }
}
