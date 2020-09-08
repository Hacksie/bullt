using System;

namespace Bullt.Data.Entities
{
    public class Item
    {
        public string Id { get; set; }

        public string ParentId { get; set; }

        public int Stage { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Summary { get; set; }
    }
}
