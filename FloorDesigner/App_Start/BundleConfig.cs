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
                        "~/Scripts/jquery-{version}.js"
                        ));

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
          "~/Scripts/gsap/TweenMax.js",
          "~/Scripts/gsap/TweenLite.js",
          "~/Scripts/gsap/TimelineMax.js",
           "~/Scripts/gsap/easing/EasePack.js",
           "~/Scripts/gsap/jquery.gsap.js",
           "~/Scripts/gsap/utils/Draggable.js",
           "~/Scripts/gsap/plugins/AttrPlugin.js",
           "~/Scripts/gsap/plugins/BezierPlugin.js",
           "~/Scripts/gsap/plugins/ColorPropsPlugin.js",
           "~/Scripts/gsap/plugins/CSSPlugin.js",
           "~/Scripts/gsap/plugins/CSSRulePlugin.js",
           "~/Scripts/gsap/plugins/DirectionalRotationPlugin.js",
           "~/Scripts/gsap/plugins/EaselPlugin.js",
           "~/Scripts/gsap/plugins/EndArrayPlugin.js",
           "~/Scripts/gsap/plugins/KineticPlugin.js",
           "~/Scripts/gsap/plugins/Physics2DPlugin.js",
           "~/Scripts/gsap/plugins/PhysicsPropsPlugin.js",
           "~/Scripts/gsap/plugins/RaphaelPlugin.js",
           "~/Scripts/gsap/plugins/RoundPropsPlugin.js",
           "~/Scripts/gsap/plugins/ScrambleTextPlugin.js",
           "~/Scripts/gsap/plugins/ScrollToPlugin.js",
           "~/Scripts/gsap/plugins/TextPlugin.js",
           "~/Scripts/gsap/plugins/ThrowPropsPlugin.js",
           "~/Scripts/gsap/plugins/TEMPLATE_Plugin.js"
          ));

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                "~/Scripts/Common/debugCfg.js",
                "~/Scripts/Common/roomsCfg.js"));

            bundles.Add(new ScriptBundle("~/bundles/designer").Include(
                "~/Scripts/Designer/designer.js"));

            bundles.Add(new ScriptBundle("~/bundles/finder").Include(
                "~/Scripts/Finder/finder.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.css",
                "~/Content/Site.css"));
        }
    }
}
