using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FloorDesigner.Models
{
    public class FloorItem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Xpos { get; set; }
        public int Ypos { get; set; }
        public int Rotation { get; set; }
        public int FloorLayoutId { get; set; }
        [ForeignKey("FloorLayoutId")]
        public FloorLayout FloorLayout { get; set; }
    }
}