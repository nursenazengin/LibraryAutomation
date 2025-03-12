using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public AuthorsController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllAuthors()
        {
            var allAuthors = dbContext.Authors.ToList();

            return Ok(allAuthors);
        }

        [HttpPost]
        public IActionResult addAuthor(AddAuthorDto addAuthorDto)
        {
            var authorEntity = new Author()
            {
                name = addAuthorDto.name,
            };
            dbContext.Authors.Add(authorEntity);

            dbContext.SaveChanges();

            return Ok(authorEntity);
        }

        [HttpPut]
        [Route("{author_id:guid}")]
        public IActionResult updateAuthor(UpdateAuthorDto updateAuthorDto, Guid author_id)
        {
            var author = dbContext.Authors.Find(author_id);

            if (author is null)
            {
                return NotFound();
            }

            author.name = updateAuthorDto.name;

            dbContext.SaveChanges();

            return Ok(author);
        }

        [HttpDelete]
        [Route("{author_id:guid}")]
        public IActionResult deleteAuthor(Guid author_id)
        {
            var author = dbContext.Authors.Find(author_id);

            if (author is null)
            {
                return NotFound();
            }

            dbContext.Authors.Remove(author);
            dbContext.SaveChanges();

            return Ok(author);
        }

    }


}
