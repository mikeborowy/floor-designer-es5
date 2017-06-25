using FloorDesigner.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FloorDesigner.Context
{
    public class IkeaDBContextSeed : DropCreateDatabaseIfModelChanges<IkeaDB>
    {
        protected override void Seed(IkeaDB context)
        {
            Floor f1 = new Floor()
            {
                Name = "Floor 1",
                OfficeId = 1,
                Width = 12,
                Height = 10,
                Image = "../Images/blueprints/bgnd_12x10.jpg",
                Rooms = new List<Room>() {
                //    new Room(){
                //        Shape = "room-sqr-2x2",
                //        Width = 2,
                //        Height = 2,
                //        Xpos = 0,
                //        Ypos = 0,
                //        Rotation = 0
                        
                //    },
                //     new Room(){
                //        Shape = "room-l-3x3",
                //        Width = 3,
                //        Height = 3,
                //        Xpos = 6,
                //        Ypos = 6,
                //        Rotation = 0

                //    }
                }
            };

            context.Floors.Add(f1);

            base.Seed(context);
        }
    }
}