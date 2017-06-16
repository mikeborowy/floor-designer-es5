using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FloorDesigner.Controllers
{
    public class DesignerController : Controller
    {
        // GET: Designer
        public ActionResult Index()
        {
            return View();
        }
    }
}
