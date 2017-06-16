using FloorDesigner.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FloorDesigner.Context
{
    public class DesignerDBContext:DbContext
    {
        public DbSet<Floor> Floors { get; set; }
        public DbSet<FloorLayout> FloorLayouts { get; set; }
        public DbSet<FloorItem> FloorItems { get; set; }
    }
}