using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FloorDesigner.Models
{
    public class FloorLayout
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Xpos { get; set; }
        public int Ypos { get; set; }
        public string Image { get; set; }
        public virtual ICollection FloorItems { get; set; }
        public int FloorId { get; set; }
        [ForeignKey("FloorId ")]
        public Floor Floor { get; set; }
    }
}