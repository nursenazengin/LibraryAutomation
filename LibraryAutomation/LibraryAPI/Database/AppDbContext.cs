using LibraryAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Database
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Book> Books { get; set; }

        public DbSet<Author> Authors { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Admin> Admins { get; set; }


        public DbSet<UserBorrowedBook> UserBorrowedBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Author>().ToTable("authors");
            modelBuilder.Entity<Book>().ToTable("books");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Admin>().ToTable("admins");
            modelBuilder.Entity<UserBorrowedBook>().ToTable("user_borrowed_books");


            modelBuilder.Entity<Category>()
                .HasKey(x => x.category_id);

            modelBuilder.Entity<Category>()
                .HasMany(x => x.Books)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.category_id);

            modelBuilder.Entity<Book>().HasKey(x => x.book_id);

            modelBuilder.Entity<Book>().HasOne(x => x.Category).WithMany(x => x.Books).HasForeignKey(x => x.category_id);


            modelBuilder.Entity<Author>()
                .HasKey(x => x.author_id);

            modelBuilder.Entity<Author>()
                .HasMany(x => x.Books)
                .WithOne(x => x.Author)
                .HasForeignKey(x => x.author_id);

            modelBuilder.Entity<Book>().HasKey(x => x.book_id);

            modelBuilder.Entity<Book>().HasOne(x => x.Author).WithMany(x => x.Books).HasForeignKey(x => x.author_id);

            modelBuilder.Entity<UserBorrowedBook>()
                .HasKey(ub => ub.borrowed_id);  // Primary Key

            modelBuilder.Entity<UserBorrowedBook>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.BorrowedBooks)
                .HasForeignKey(ub => ub.user_id)
                .OnDelete(DeleteBehavior.Cascade);  

            modelBuilder.Entity<UserBorrowedBook>()
                .HasOne(ub => ub.Book)
                .WithMany(b => b.Borrowers)
                .HasForeignKey(ub => ub.book_id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
