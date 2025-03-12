namespace LibraryAPI.Models.Entities
{
    public class Admin
    {
        public Guid id { get; set; }

        public string? name { get; set; }

        public string? email { get; set; }

        public string? password { get; set; }

    }
}
