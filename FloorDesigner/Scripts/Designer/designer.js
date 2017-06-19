(function () {
    $(document).ready(function () {

        var toolbarHeight = $("#designer-toolbar").height();

        $(window).resize(function () {

            RefreshSeatingPlanScreen();

        });

        RefreshSeatingPlanScreen();
        shapeListBtnInit();
        /**
        * SHAPES PANEL START
        */
        function shapeListBtnInit() {

            var shapeListBtnConfig = {

                normal: {
                    smlBarWidth: 5,
                    color: 'rgb(68,138,255)',
                    primaryContentX: 0,
                    animationTime: 0.2
                },
                over: {
                    smlBarWidth: 15,
                    color: 'rgb(255,235,59)',
                    primaryContentX: 10,
                    primaryContentAnimationDelay: 0.1,
                    animationTime: 0.2
                }
            }

            $.each($(".shape-list-btn"), function (i, shapeListBtn) {
                console.log("tata")

                $(shapeListBtn).mouseover(function (evt) {
                    OnMouseOver($(this), shapeListBtnConfig.over)
                });

                $(shapeListBtn).mouseout(function (evt) {
                    OnMouseOut($(this), shapeListBtnConfig.normal)
                });
            });

            function OnMouseOver(btn, cfg) {

                //console.log(btn.find(".shape-list-title").html());
                var bar = btn.find('.shape-list-sml-bar');
                TweenLite.to(bar, cfg.animationTime, {
                    width: cfg.smlBarWidth,
                    backgroundColor: cfg.color
                });

                var primaryContent = btn.find('.mdl-list__item-primary-content')
                TweenLite.to(primaryContent, cfg.animationTime + cfg.primaryContentAnimationDelay, {
                    x: cfg.primaryContentX
                });
            }

            function OnMouseOut(btn, cfg) {

                var bar = btn.find('.shape-list-sml-bar');
                TweenLite.to(bar, cfg.animationTime, {
                    width: cfg.smlBarWidth,
                    backgroundColor: cfg.color
                });

                var primaryContent = btn.find('.mdl-list__item-primary-content')
                TweenLite.to(primaryContent, cfg.animationTime, {
                    x: cfg.primaryContentX
                });
            }
        }

        /**
        * SHAPES PANEL END
        */

        /**
         * CREATE DRAGGABLE STAGE START
         */

        var draggableObj = Draggable.create($("#room-container"), {
            type: "scroll",
            edgeResistance: 1,
            throwProps: true,
            lockAxis: true
        });

        Draggable.get("#room-container").disable();

        /**
        * CREATE DRAGGABLE STAGE END
        */

        /**
        * ZOOM MOUSE WHEEL START
        */
        var zoomMouse = false;
        var roomScaleNum = 1;
        var roomScaleNumMin = 0.2;
        var roomScaleNumMax = 2;

        $('#room-container').bind('wheel mousewheel', OnZoomWheel);

        function OnZoomWheel(evt) {

            if (zoomMouse) {

                var delta;

                if (evt.originalEvent.wheelDelta !== undefined)
                    delta = evt.originalEvent.wheelDelta;
                else
                    delta = evt.originalEvent.deltaY * -1;

                if (delta > 0) {
                    roomScaleNum += 0.1;
                }
                else {
                    roomScaleNum -= 0.1;
                }

                ZoomStage();

                document.querySelector('#zoom-slider').MaterialSlider.change((roomScaleNum - 1) * 10);
                //$("#zoom-slider").get(0).MaterialTextfield.change((roomScaleNum - 1) * 10);
            }
        };

        $('#zoom-slider').on('input', function () {
            OnSliderZoom(this.value);
        });

        function OnSliderZoom(val) {

            roomScaleNum = (val * 0.1) + 1;
            ZoomStage();
        }

        function ZoomStage() {

            var room = $('#room');
            var roomContainer = $('#room-container');

            //TweenLite.killTweensOf(room);
            //TweenLite.killTweensOf(roomContainer);

            if (roomScaleNum < roomScaleNumMin) {
                roomScaleNum = 0.2;
            }
            if (roomScaleNum > roomScaleNumMax) {
                roomScaleNum = 2;
            }

            TweenMax.to(room, 0.3, {
                scaleX: roomScaleNum,
                scaleY: roomScaleNum,
            });

            var posX = (roomContainer.width() / 2 - room.width() / 2)
            var roomWidthAfterScale = room.width() * roomScaleNum;

            var posY = (roomContainer.height() / 2 - room.height() / 2)
            var roomHeightAfterScale = room.height() * roomScaleNum;

            //First for horizontal scale scroll issue
            //check if scaled room width is bigger than room conatiner
            //if true align to left
            if (roomWidthAfterScale >= roomContainer.width()) {
                TweenMax.set(room, {
                    transformOrigin: "0 50%",
                    x: 0,
                    y: posY
                });

                //then check if scaled room height is bigger than room conatiner 
                //and align to top
                if (roomHeightAfterScale >= roomContainer.height()) {
                    TweenMax.set(room, {
                        transformOrigin: "0% 0%",
                        x: 0,
                        y: 0
                    });
                }

            }
            //for vertical scale scroll issue
            //check if scaled room height is bigger than room conatiner 
            //if true align to top
            else if (roomHeightAfterScale >= roomContainer.height()) {
                TweenMax.set(room, {
                    transformOrigin: "50% 0%",
                    x: posX,
                    y: 0
                });

                //then check if scaled room width is bigger than room conatiner 
                //and align to left
                if (roomWidthAfterScale >= roomContainer.width()) {
                    TweenMax.set(room, {
                        transformOrigin: "0 0",
                        x: 0,
                        y: 0
                    });
                }

            }
            //otherwise appply regular scale with centerd point
            else {
                TweenMax.set(room, {
                    transformOrigin: "50% 50%",
                    x: posX,
                    y: posY
                });
            }
        }

        /**
         * ZOOM MOUSE WHEEL END
         */

        /**
          * ON KEY UP/DOWN START
          */

        $(document).on('keyup', OnKeyUp);
        $(document).on('keydown', OnKeyDown);

        function OnKeyDown(evt) {

            var stageContainer = $("#room-container");
            var room = $("#room");

            //zoom with "Z"
            if (evt.keyCode === 90) {
                zoomMouse = true;

                stageContainer.css({ "overflow-x": "hidden" });
                stageContainer.css({ "overflow-y": "hidden" });
            }

            //drag stage with "X"
            if (evt.keyCode === 88) {

                if ($('#room-blocker').length === 0)
                    $('<div>')
                        .attr('id', 'room-blocker').attr('class', 'room-blocker-inv').appendTo(room);

                Draggable.get("#room-container").enable();
                //Draggable.get("#sp-seating-container").applyBounds({ top: 0, left: 0, width: roomWidthOrg * roomScaleNum, height: roomHeightOrg * roomScaleNum });
            }
        }

        function OnKeyUp(evt) {

            var stageContainer = $("#room-container");

            //zoom with "Z"
            if (evt.keyCode === 90) {
                zoomMouse = false;

                $("#room-container").css({ "overflow-x": "auto" });
                $("#room-container").css({ "overflow-y": "auto" });
            }

            //drag stage with "X"
            if (evt.keyCode === 88) {

                if ($('#room-blocker').length > 0)
                    $('#room-blocker').remove();

                Draggable.get("#room-container").disable();

            }
        }


        /**
          * ON KEY UP/DOWN END
          */


        function RefreshSeatingPlanScreen() {
            UpdateProps();

        }

        function UpdateProps() {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            $("#shapes-panel").height(
                windowHeight - toolbarHeight
            )

            $("#room-container").height(
                windowHeight - toolbarHeight
            )

            var parentHeight = $("#room-container").height();
            var parentWidth = $("#room-container").width();

            if ($("#room").height() <= $("#room-container").height()) {

                var posY = (parentHeight / 2 - $("#room").height() / 2);
                TweenLite.to($("#room"), 0, { y: posY })
            }

            var posX = (parentWidth / 2 - $("#room").width() / 2)

            TweenLite.to($("#room"), 0, { x: posX })

            //if ($("#room").width() <= $("#room-container").width()) {
            //$("#room").offset({ right: posX });
            //}
        }
    });
})()