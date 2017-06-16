using FloorDesigner.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FloorDesigner.Context
{
    public class DesignerDBContextSeed : DropCreateDatabaseIfModelChanges<DesignerDBContext>
    {
        protected override void Seed(DesignerDBContext context)
        {
            Floor f1 = new Floor()
            {
                Name = "Floor 1",
                OfficeId = 1
            };

            context.Floors.Add(f1);

            FloorLayout fl1 = new FloorLayout()
            {
                Name = "Floor Layout 1",
                Width = 11,
                Height = 11,
                Image = "~/Images/example_floor1.jpg",
                FloorItems = new List<FloorItem>() {
                    new FloorItem () {
                        Name = "Item 1",
                        Xpos = 2,
                        Ypos = 2,
                        Width = 2,
                        Height = 2,
                        Rotation = 0
                    },
                     new FloorItem () {
                        Name = "Item 2",
                        Xpos = 2,
                        Ypos = 5,
                        Width = 3,
                        Height = 2,
                        Rotation = 0
                    }
                }
            };

            context.FloorLayouts.Add(fl1);

            base.Seed(context);
        }
    }
}