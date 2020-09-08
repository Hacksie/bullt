using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Bullt.Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Bullt.Data
{
    public class DataSeeder
    {
        private readonly ApplicationDbContext ctx;
        private readonly IWebHostEnvironment env;
        
        public DataSeeder(ApplicationDbContext ctx, IWebHostEnvironment env)
        {
            this.ctx = ctx;
            this.env = env;
        }

        public async Task SeedAsync()
        {
            /*
            this.ctx.Database.EnsureCreated();

            var user = new ApplicationUser
            {
                UserName = "ben@hackeddesign.com",
                NormalizedUserName = "ben@hackeddesign.com",
                Email = "ben@hackeddesign.com",
                NormalizedEmail = "ben@hackeddesign.com",
                EmailConfirmed = true,
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString()
            };


            var roleStore = new RoleStore<IdentityRole>(this.ctx);

            if (!this.ctx.Roles.Any(r => r.Name == "admin"))
            {
                await roleStore.CreateAsync(new IdentityRole { Name = "admin", NormalizedName = "admin" });
            }

            if (!this.ctx.Users.Any(u => u.UserName == user.UserName))
            {
                var password = new PasswordHasher<ApplicationUser>();
                var hashed = password.HashPassword(user, "password");
                user.PasswordHash = hashed;
                var userStore = new UserStore<ApplicationUser>(this.ctx);
                await userStore.CreateAsync(user);
                await userStore.AddToRoleAsync(user, "admin");
            }
            */
            await this.ctx.SaveChangesAsync();
        }

    }
}