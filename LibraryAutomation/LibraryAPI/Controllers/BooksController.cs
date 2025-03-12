using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public BooksController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpGet]
        public IActionResult GetAllBooks() //Read operation
        {
            var allBooks = dbContext.Books.ToList();

            return Ok(allBooks);
        }

        [HttpGet]
        [Route("category/{category_id:guid}")]
        public IActionResult GetBooksFindByCategoryId(Guid category_id)
        {
            var books = dbContext.Books.Where(b => b.category_id == category_id).ToList();
      
            return Ok(books);
        }

        [HttpGet]
        [Route("author/{author_id:guid}")]
        public IActionResult GetBooksFindByAuthorId(Guid author_id)
        {
            var books = dbContext.Books.Where(b => b.author_id == author_id).ToList();
            
            return Ok(books);
        }
        


        [HttpPost]
        [Route("stock/{book_id}")]
        public IActionResult GetStockByBookId(Guid book_id)
        {
            var book = dbContext.Books.FirstOrDefault(b => b.book_id == book_id);

            if (book == null)
    {
                return NotFound(new { message = "Kitap bulunamadı" });
            }

            if (book.stock > 0)
            {
                book.stock--;
            
                dbContext.SaveChanges();
                return Ok(new { message = "Book is borrowed" , remainingStock = book.stock });

            }

            else
            {
                return BadRequest(new { message = "This book is out of stock!" });
            }
                }



        [HttpPost]
        public IActionResult AddBook([FromForm] AddBookDto addBookDto)
        {
            string? imagePath = null;

            if (addBookDto.image_url != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(addBookDto.image_url.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    addBookDto.image_url.CopyTo(stream);
                }

                imagePath = "/uploads/" + fileName; 
            }

            var bookEntity = new Book()
            {
                name = addBookDto.name,
                image_url = imagePath, 
                author_id = addBookDto.author_id,
                category_id = addBookDto.category_id,
                stock = addBookDto.stock
            }; 

            dbContext.Books.Add(bookEntity);
            dbContext.SaveChanges();

            return Ok(bookEntity);
        }


        [HttpPut]
        [Route("{book_id:guid}")]
        public IActionResult UpdateBook(Guid book_id, [FromForm] UpdateBookDto updateBookDto)
        {
            var book = dbContext.Books.Find(book_id);

            if (book is null)
            {
                return NotFound();
            }

            
            if (updateBookDto.image_url != null)
            {
                
                if (!string.IsNullOrEmpty(book.image_url))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.image_url.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Yeni resmi kaydet
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updateBookDto.image_url.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    updateBookDto.image_url.CopyTo(stream);
                }

                book.image_url = "/uploads/" + fileName;
            }

            
            book.name = updateBookDto.name;
            book.author_id = updateBookDto.author_id;
            book.category_id = updateBookDto.category_id;
            book.stock = updateBookDto.stock;

            dbContext.SaveChanges();

            return Ok(book);
        }



        [HttpDelete]
        [Route("{book_id:guid}")]
        public IActionResult DeleteBook(Guid book_id)   //delete
        {

            var book = dbContext.Books.Find(book_id);

            if(book is null)
            {
                return NotFound();
            }


            dbContext.Books.Remove(book);
            dbContext.SaveChanges();

            return Ok(book);

        }
    }
}
