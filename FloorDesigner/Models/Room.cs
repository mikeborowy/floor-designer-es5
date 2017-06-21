using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FloorDesigner.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Shape { get; set; }
        [Required]
        public int Width { get; set; }
        [Required]
        public int Height { get; set; }
        [Required]
        public int Xpos { get; set; }
        [Required]
        public int Ypos { get; set; }
        [Required]
        public int Rotation { get; set; }

        public int FloorId { get; set; }
        public virtual Floor Floor { get; set; }
    }
}