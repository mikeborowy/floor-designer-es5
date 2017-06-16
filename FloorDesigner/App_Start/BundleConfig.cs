using System.Web;
using System.Web.Optimization;

namespace FloorDesigner
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/mdl").Include(
                "~/Scripts/material.js"));

            bundles.Add(new ScriptBundle("~/bundles/gsap").Include(
          "~/Scripts/_gsap/TweenMax.js",
          "~/Scripts/_gsap/TweenLite.js",
          "~/Scripts/_gsap/TimelineMax.js",
           "~/Scripts/_gsap/easing/EasePack.js",
           "~/Scripts/_gsap/jquery.gsap.js",
           "~/Scripts/_gsap/utils/Draggable.js",
           "~/Scripts/_gsap/plugins/AttrPlugin.js",
           "~/Scripts/_gsap/plugins/BezierPlugin.js",
           "~/Scripts/_gsap/plugins/ColorPropsPlugin.js",
           "~/Scripts/_gsap/plugins/CSSPlugin.js",
           "~/Scripts/_gsap/plugins/CSSRulePlugin.js",
           "~/Scripts/_gsap/plugins/DirectionalRotationPlugin.js",
           "~/Scripts/_gsap/plugins/EaselPlugin.js",
           "~/Scripts/_gsap/plugins/EndArrayPlugin.js",
           "~/Scripts/_gsap/plugins/KineticPlugin.js",
           "~/Scripts/_gsap/plugins/Physics2DPlugin.js",
           "~/Scripts/_gsap/plugins/PhysicsPropsPlugin.js",
           "~/Scripts/_gsap/plugins/RaphaelPlugin.js",
           "~/Scripts/_gsap/plugins/RoundPropsPlugin.js",
           "~/Scripts/_gsap/plugins/ScrambleTextPlugin.js",
           "~/Scripts/_gsap/plugins/ScrollToPlugin.js",
           "~/Scripts/_gsap/plugins/TextPlugin.js",
           "~/Scripts/_gsap/plugins/ThrowPropsPlugin.js",
           "~/Scripts/_gsap/plugins/TEMPLATE_Plugin.js"
          ));


            bundles.Add(new ScriptBundle("~/bundles/designer").Include(
         "~/Scripts/designer.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/Site.css"));
        }
    }
}
