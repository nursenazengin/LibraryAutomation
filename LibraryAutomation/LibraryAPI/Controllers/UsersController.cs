using LibraryAPI.Database;
using LibraryAPI.Models;
using LibraryAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;

        public UsersController(AppDbContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginDto loginDto)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.email == loginDto.email
            && x.password == loginDto.password);

            if(user != null)
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub,configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("id", user.id.ToString()),
                    new Claim("email", user.email.ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    configuration["Jwt:Issuer"],
                    configuration["Jwt:Audience"],
                    claims,
                    expires : DateTime.UtcNow.AddMinutes(60),
                    signingCredentials : signIn
                    );
                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new { Token = tokenValue, User = user });
                //return Ok(user);
            }

            return NoContent();
        }


        //[Authorize]
        [HttpGet]
        public IActionResult getAllUsers()
        {
            var allUsers = dbContext.Users.ToList();

            return Ok(allUsers);
        }

        [HttpGet]
        [Route("user/{id}")]
        public IActionResult GetUserFindById(Guid id)
        {
            var user = dbContext.Users
                .Where(u => u.id == id)
                .Select(u => new { u.email, u.password })
                .ToList(); 

            return Ok(user); 
        }

        [Authorize]
        [HttpPut]
        [Route("update/{id}")]
        public IActionResult updateUserById(Guid id, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.id == id);

            user.email = updateUserDto.email;
            user.password = updateUserDto.password;

            dbContext.SaveChanges();

           

            return Ok();
        }

        [HttpPost]
        public IActionResult addUser(AddUserDto addUserDto)
        {
            var userEntity = new User()
            {
                name = addUserDto.name,
                email = addUserDto.email,
                password = addUserDto.password
            };
            dbContext.Users.Add(userEntity);

            dbContext.SaveChanges();

            return Ok(userEntity);
        }


        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult updateUser(UpdateUserDto updateUserDto, Guid id)
        {
            var user = dbContext.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }

            user.email = updateUserDto.email;
            user.password = updateUserDto.password;

            dbContext.SaveChanges();

            return Ok(user);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult deleteUser(Guid id)
        {
            var user = dbContext.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }

            dbContext.Users.Remove(user);

            dbContext.SaveChanges();

            return Ok(user);
        }


    }
}
