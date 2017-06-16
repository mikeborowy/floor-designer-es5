using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FloorDesigner.Models
{
    public class Floor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OfficeId { get; set; }
    }
}