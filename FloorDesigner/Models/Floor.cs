using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FloorDesigner.Models
{
    public class Floor
    {
        [Key]
        public int Id { get; set; }
        public int OfficeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Width { get; set; }
        [Required]
        public int Height { get; set; }
        public int Xpos { get; set; }
        public int Ypos { get; set; }
        public string Image { get; set; }

        public virtual ICollection<Room> Rooms { get; set; }
    }
}