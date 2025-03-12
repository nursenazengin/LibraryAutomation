using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
namespace LibraryAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]     
    public class BorrowBooksController : Controller
    {

        private readonly AppDbContext dbContext;

        public BorrowBooksController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        //ödünç alınan kitap bilgilerini getiriyor
        [HttpGet]
        [Route("user_borrow_book/{user_id}")]
        public IActionResult getBorrowBook(Guid user_id)
        {
            var borrow_books = dbContext.UserBorrowedBooks
                .Where(u => u.user_id == user_id)
                .Include(u => u.Book)
                .Select(u => new
                {
                    u.borrowed_id,
                    u.due_date ,
                    returned_at = u.returned_at == null ? "Borrowed" : u.returned_at.ToString(),
                    book_id = u.Book.book_id,
                    book_name = u.Book.name,
                    book_image = u.Book.image_url
                })
                .ToList();

            

            return Ok(borrow_books);
        }


        //teslim edildi olmasını sağlayan metot 
        [HttpPut]
        [Route("returned_book/{borrowed_id}")]
        public IActionResult returnBook(Guid borrowed_id)
        {
            var borrowedBook = dbContext.UserBorrowedBooks.FirstOrDefault(
                u => u.borrowed_id == borrowed_id);

            if (borrowedBook == null)
            {
                return NotFound(new { message = "Kitap bulunamadı!" });
            }
             
            borrowedBook.returned_at = DateTime.UtcNow;

            dbContext.SaveChanges();

            return Ok(new {returned_at = borrowedBook.returned_at});

        }


        //teslim edildikten sonra borç varsa döndürür
        [HttpGet]
        [Route("returned_book/{borrowed_id}")]
        public IActionResult getReturnedBook(Guid borrowed_id)
        {
            var returned_book = dbContext.UserBorrowedBooks.
                Where(u => u.borrowed_id == borrowed_id)
                .Include(u => u.Book)
                .Select(u => new
                {
                    u.borrowed_id,
                    u.due_date,
                    u.borrowed_at,
                    u.returned_at,
                    DaysBetween = (u.returned_at.GetValueOrDefault() - u.borrowed_at.GetValueOrDefault()).Days, 
                    fee = ((u.returned_at.GetValueOrDefault() - u.borrowed_at.GetValueOrDefault()).AddDays > 10)
                        ? ((u.returned_at.GetValueOrDefault() - u.borrowed_at.GetValueOrDefault()).AddDays - 10) * 10
                        : 0
                });
                
            return Ok(returned_book);
        }

        //ödünç alınan tüm kitapları döndürür
        [HttpGet]
        public IActionResult GetBorrowedBooks()
        {
            var allBorrowedBooks = dbContext.UserBorrowedBooks.ToList();

            return Ok(allBorrowedBooks);
        }


        //ödünç almayı sağlıyor
        [HttpPost]
        public IActionResult AddBorrowBook([FromBody] AddBorrowBookDto addBorrowBookDto)
        {
            var existingBorrow = dbContext.UserBorrowedBooks
                .FirstOrDefault(b => b.user_id == addBorrowBookDto.user_id
                                  && b.book_id == addBorrowBookDto.book_id
                                  && b.returned_at == null); 

            if (existingBorrow != null)
            {
                return BadRequest(new { message = "Bu kitap zaten ödünç alınmış ve henüz iade edilmemiş!" });
            }

            var borrowedAt = DateTime.UtcNow;
            var dueDate = borrowedAt.AddDays(10.0);

            var newBorrow = new UserBorrowedBook
            {
                //borrowed_id = Guid.NewGuid(),
                user_id = addBorrowBookDto.user_id,
                book_id = addBorrowBookDto.book_id,
                borrowed_at = borrowedAt,
                due_date = dueDate,
                returned_at = null 
            };

            dbContext.UserBorrowedBooks.Add(newBorrow);
            dbContext.SaveChanges();

            return Ok(new { message = "Kitap başarıyla ödünç alındı!" });
        }


        //teslim edildi mi kontrol ediyor
        [HttpGet]
        [Route("user/{user_id}/book/{book_id}")]
        public IActionResult CheckBorrowed(Guid user_id, Guid book_id)
        {
            var borrowRecord = dbContext.UserBorrowedBooks
                .FirstOrDefault(b => b.user_id == user_id
                && b.book_id == book_id && !b.returned_at.HasValue);

            if(borrowRecord == null)
            {
                return Ok("kitap teslim edilmemiş");
            }

            return Ok(new { isBorrowed = borrowRecord != null });
        }
             

    }
}
