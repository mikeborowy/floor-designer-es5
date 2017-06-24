(function () {
    $(document).ready(function () {

        //GLOBAL VARS START
        //---stage---\\
        var floorCfg = {
            id: 4,
            officeId: 1,
            name: "Floor 1",
            width: 15,
            height: 10,
            xpos: 0,
            ypos: 0,
            image: null,
            rooms: []
        }

        initApp();

        function initApp() {

            $(window).resize(function () {
                RefreshSeatingPlanScreen();
            });

            RefreshSeatingPlanScreen();

            initSearchPanel();
            initToolbar();
        }

        function initSearchPanel() {

            $("#search-room-form").submit(function (e) {
                return false;
            });

            $('#find-room-btn').click(onFindRoomClick);

            function onFindRoomClick(evt) {
               console.log("loadFloor()")
            }

        }

        function initToolbar() {

            $('#designer-floor-btn').click(onDesignerBtnClick);

            function onDesignerBtnClick() {
                var url = $(this).data('url');
                window.location.href = url;
            }
        }

        function RefreshSeatingPlanScreen() {
            UpdateProps();
        }

        function UpdateProps() {
            var toolbarHeight = $("#finder-toolbar").height();
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            $("#finder-search-panel").height(
                windowHeight - toolbarHeight
            )

            //$("#stage-container").height(
            //    windowHeight - toolbarHeight
            //)

            //var parentHeight = $("#stage-container").height();
            //var parentWidth = $("#stage-container").width();

            //if ($("#stage").height() <= $("#stage-container").height()) {

            //    var posY = (parentHeight / 2 - $("#stage").height() / 2);
            //    TweenLite.to($("#stage"), 0, { y: posY })
            //}
            //else {
            //    TweenLite.to($("#stage"), 0, { y: 0 })
            //}

            //if ($("#stage").width() <= $("#stage-container").width()) {
            //    var posX = (parentWidth / 2 - $("#stage").width() / 2)
            //    TweenLite.to($("#stage"), 0, { x: posX })
            //}
            //else {
            //    TweenLite.to($("#stage"), 0, { x: 0 })
            //}

            //if ($("#stage").width() <= $("#stage-container").width()) {
            //$("#stage").offset({ right: posX });
            //}
        }
    });
})();