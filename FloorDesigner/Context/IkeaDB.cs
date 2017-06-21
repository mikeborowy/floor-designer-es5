using FloorDesigner.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace FloorDesigner.Context
{
    public class IkeaDB : DbContext
    {
        public DbSet<Floor> Floors { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Floor>().HasKey(t => t.Id);

            modelBuilder.Entity<Room>().HasKey(t => t.Id);
            modelBuilder.Entity<Room>().HasRequired(t => t.Floor).WithMany(t => t.Rooms).WillCascadeOnDelete();
        }
    }
}