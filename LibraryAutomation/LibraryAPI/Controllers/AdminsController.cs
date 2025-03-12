using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : Controller
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;

        public AdminsController(AppDbContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginDto loginDto)
        {
            var admin = dbContext.Admins.FirstOrDefault(x => x.email == loginDto.email
            && x.password == loginDto.password);

            if (admin != null)
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub,configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("id", admin.id.ToString()),
                    new Claim("email", admin.email.ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    configuration["Jwt:Issuer"],
                    configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signIn
                    );
                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new { Token = tokenValue, Admin = admin });
                //return Ok(user);
            }

            return NoContent();
        }


        [HttpGet]
        public IActionResult getAllAdmins()
        {
            var allAdmins = dbContext.Admins.ToList();
            
            return Ok(allAdmins);
        }

        [HttpPost]
        public IActionResult addUser(AddAdminDto addAdminDto)
        {
            var adminEntity = new Admin()
            {
                name = addAdminDto.name,
                email = addAdminDto.email,
                password = addAdminDto.password
            };

            dbContext.Admins.Add(adminEntity);
            dbContext.SaveChanges();

            return Ok(adminEntity);

        }


        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult updateAdmin(UpdateAdminDto updateAdminDto, Guid id) 
        {
            var admin = dbContext.Admins.Find(id);

            if(admin is null)
            {
                return NotFound();
            }

            admin.name = updateAdminDto.name;
            admin.email = updateAdminDto.email;
            admin.password = updateAdminDto.password;

            dbContext.SaveChanges();

            return Ok(admin);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult deleteAdmin(Guid id)
        {
            var admin = dbContext.Admins.Find(id);

            if (admin is null)
            {
                return NotFound();
            }

            dbContext.Admins.Remove(admin);

            return Ok(admin);

        }


        [HttpGet]
        [Route("admin/{id}")]
        public IActionResult GetUserFindById(Guid id)
        {
            var admin = dbContext.Admins
                .Where(a => a.id == id)
                .Select(a => new { a.email, a.password })
                .ToList();

            return Ok(admin);
        }

        [Authorize]
        [HttpPut]
        [Route("update/{id}")]
        public IActionResult updateAdminById(Guid id, [FromBody] UpdateAdminDto updateAdminDto)
        {
            var admin = dbContext.Admins.FirstOrDefault(x => x.id == id);

            admin.email = updateAdminDto.email;
            admin.password = updateAdminDto.password;

            dbContext.SaveChanges();



            return Ok();
        }








    }
}
