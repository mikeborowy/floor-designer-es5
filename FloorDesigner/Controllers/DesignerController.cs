using FloorDesigner.Context;
using FloorDesigner.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FloorDesigner.Controllers
{
    public class DesignerController : Controller
    {
        private IkeaDB db = new IkeaDB();

        // GET: Designer
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetFloorsList()
        {
            List<Floor> floorList = db.Floors.ToList();

            return PartialView("searchPanelFloorsList", floorList);
        }
    }
}
