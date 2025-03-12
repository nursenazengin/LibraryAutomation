using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {

        private readonly AppDbContext dbContext;

        public CategoriesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllCategories()
        {
            var allCategories = dbContext.Categories.ToList();

            return Ok(allCategories);
        }

        [HttpPost]
        public IActionResult addCategory(AddCategoryDto addCategoryDto)
        {
            var categoryEntity = new Category()
            {
                name = addCategoryDto.name,
            };
            dbContext.Categories.Add(categoryEntity);

            dbContext.SaveChanges();

            return Ok(categoryEntity);
        }

        [HttpPut]
        [Route("{category_id:guid}")]
        public IActionResult updateCategory(UpdateCategoryDto updateCategoryDto, Guid category_id)
        {
            var category = dbContext.Categories.Find(category_id);

            if (category is null)
            {
                return NotFound();
            }

            category.name = updateCategoryDto.name;

            dbContext.SaveChanges();

            return Ok(category);
        }


        [HttpDelete]
        [Route("{category_id:guid}")]
        public IActionResult deleteCategory(Guid category_id)
        {
            var category = dbContext.Categories.Find(category_id);

            if (category is null)
            {
                return NotFound();
            }

            dbContext.Categories.Remove(category);

            dbContext.SaveChanges();

            return Ok(category);
        }
    }
}
