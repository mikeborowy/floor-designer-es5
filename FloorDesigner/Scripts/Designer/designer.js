(function () {
    $(document).ready(function () {

        var toolbarHeight = $("#designer-toolbar").height();

        $(window).resize(function () {

            RefreshSeatingPlanScreen();

        });

        RefreshSeatingPlanScreen();

        /**
        * SHAPES PANEL START
        */


        $.each($(".shape-list-btn"), function (i, shapeListBtn) {

            $(shapeListBtn).mouseover(function (evt) {
                OnMouseOver($(this))
            });

            $(shapeListBtn).mouseout(function (evt) {
                OnMouseOut($(this))
            });
        });

        function OnMouseOver(btn) {

            //console.log(btn.find(".shape-list-title").html());
            var bar = btn.find('.shape-list-sml-bar');
            TweenLite.to(bar, 0.2, { width: 15, backgroundColor: 'rgb(255,235,59)' });

            var primaryContent = btn.find('.mdl-list__item-primary-content')
            TweenLite.to(primaryContent, 0.3, { x:10 });


        }

        function OnMouseOut(btn) {

            var bar = btn.find('.shape-list-sml-bar');
            TweenLite.to(bar, 0.2, { width: 5, backgroundColor: 'rgb(68,138,255)' });

            var primaryContent = btn.find('.mdl-list__item-primary-content')
            TweenLite.to(primaryContent, 0.2, { x:0 });

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
                var room = $('#room');
                var roomContainer = $('#room-container');

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

                if (roomScaleNum < roomScaleNumMin) {
                    roomScaleNum = 0.2;
                }
                if (roomScaleNum > roomScaleNumMax) {
                    roomScaleNum = 2;
                }

                //TweenLite.killTweensOf(room);
                //TweenLite.killTweensOf(roomContainer);

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
                else if(roomHeightAfterScale >= roomContainer.height()) {
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
        }

        function scrollTo(options) {

            TweenLite.killTweensOf(('#room-container'));

            if (options) {
                var _speed = findValueByKey(options, "speed");
                var _x = findValueByKey(options, "x");
                var _y = findValueByKey(options, "y");

                if (!_speed)
                    _speed = 1;

                if (_y && !_x) {
                    TweenLite.to($('#room-container'), _speed,
                        {
                            scrollTo: { y: _y }, onComplete: updateScrollPosition
                        });
                }

                if (!_y && _x) {
                    TweenLite.to($('#room-container'), _speed,
                        {
                            scrollTo: { x: _x }, onComplete: updateScrollPosition
                        });
                }

                if (_y && _x) {
                    TweenLite.to($('#room-container'), _speed,
                        {
                            scrollTo: { y: _y, x: _x }, onComplete: updateScrollPosition
                        });
                }

            }
            else {
                alert('add paramaters: <br> {"y": num}')
            }
        }

        function updateScrollPosition(evt) {

            //console.log($('#sp-seating-container').scrollTop());
            //console.log($('#sp-seating-container').scrollLeft());
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