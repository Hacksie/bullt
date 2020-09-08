using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bullt.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Bullt.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ItemController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ItemController> _logger;

        public ItemController(ILogger<ItemController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Item> Get()
        {
            var rng = new Random();

            var results = new List<Item>()
            {
                new Item()
                {
                    ParentId = "",
                    Id="1",
                    Stage=0,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 1"
                },
                new Item()
                {
                    ParentId = "",
                    Id="2",
                    Stage=0,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 2"
                },
                new Item()
                {
                    ParentId = "",
                    Id="3",
                    Stage=1,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 3"
                },
                new Item()
                {
                    ParentId = "",
                    Id="4",
                    Stage=0,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 4"
                },
                new Item()
                {
                    ParentId = "",
                    Id="5",
                    Stage=2,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 5"
                },
                new Item()
                {
                    ParentId = "1",
                    Id="6",
                    Stage=2,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 6"
                },
                new Item()
                {
                    ParentId = "3",
                    Id="7",
                    Stage=2,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 7"
                },
                new Item()
                {
                    ParentId = "6",
                    Id="8",
                    Stage=2,
                    CreatedDate = DateTime.Now,
                    Summary = "Item 8"
                }
            };

            return results;
/*
            return Enumerable.Range(1, 5).Select(index => new Item
            {
                ParentId = "",
                Id = index.ToString(),
                Stage = rng.Next(0, 3),
                CreatedDate = DateTime.Now,
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();*/
        }
    }
}
