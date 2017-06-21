(function () {
    $(document).ready(function () {

        //GLOBAL VARS START
        //---stage---\\
        var floorCfg = {
            floorId: 1,
            width: 8,
            height: 8
        }

        var gridCellWidth = 60;
        var gridCellHeight = 60;
        //---drag-n-drop---\\
        var currentAction;
        var gridPos;
        var draggedObj;
        var dragIsOn = false;
        var rotateIsOn = false;
        var currentDraggable = null;
        var actionsOfDraggable = {
            drag: "x,y",
            rotate: "rotation",
            resize: "resize"
        }
        //---rooms---\\
        var _shapeSizes = [
            { "room-sqr-2x2": { w: 2, h: 2, t: { x: gridCellWidth, y: gridCellHeight } } },
            { "room-sqr-3x3": { w: 3, h: 3, t: { x: (2 * gridCellWidth) - (gridCellWidth * 0.5), y: (2 * gridCellHeight) - (gridCellHeight * 0.5) } } },
            { "room-rct-3x2": { w: 3, h: 2, t: { x: (3 * gridCellWidth) - (gridCellWidth * 0.5), y: (2 * gridCellHeight) - (gridCellHeight * 0.5) } } },
            { "room-l-3x2": { w: 3, h: 2, t: { x: (3 * gridCellWidth) - (gridCellWidth * 0.5), y: (2 * gridCellHeight) - (gridCellHeight * 0.5) } } }
        ];
        var paddingLeft = 0;
        var paddingTop = 0;
        //---zoom---\\
        var zoomMouse = false;
        var stageScaleNum = 1;
        var stageScaleNumMin = 0.2;
        var stageScaleNumMax = 2;
        //GLOBAL VARS END

        $(window).resize(function () {
            RefreshSeatingPlanScreen();
        });

        initApp();

        function initApp() {

            stageInit();
            shapeListInit();
            RefreshSeatingPlanScreen();
            initDragNDrop();
        }

        /**
        * STAGE START
        */

        function stageInit() {

            $('#stage').width(floorCfg.width * gridCellWidth);
            $('#stage').height(floorCfg.height * gridCellHeight);

            $('#stage-items-container').width(floorCfg.width * gridCellWidth);
            $('#stage-items-container').height(floorCfg.height * gridCellHeight);

            createGrid(gridCellWidth, gridCellHeight, floorCfg.width, floorCfg.height);
        }

        function createGrid(gridCellWidth, gridCellHeight, gridColumns, gridRows) {

            var _stage = $('#stage');
            var _stageGridBgnd = $('#stage-grid-bgnd');
            var _stageGridLive = $('#stage-grid-live');

            var w = 1;
            var h = 1;

            for (i = 0; i < gridRows * gridColumns; i++) {

                x = (i * gridCellWidth) % (gridColumns * gridCellWidth);
                y = Math.floor(i / gridColumns) * gridCellHeight;

                $("<div/>").
                    attr('id', i).
                    attr('class', 'stage-board-field-highlight').
                    css({
                        position: "absolute",
                        width: (gridCellWidth * w),
                        height: (gridCellHeight * h),
                        top: y, left: x
                    }).
                    prependTo(_stageGridLive);


                $("<div></div>").
                    attr('id', i).
                    attr('class', 'stage-board-field').
                    css({
                        position: "absolute",
                        //boxShadow: 'inset 0px 0px 0px 10px #f00',
                        border: "1px dashed rgba(0,0,0,0.05)",
                        width: gridCellWidth,
                        height: gridCellHeight,
                        top: y, left: x
                    })
                    .prependTo(_stageGridBgnd);
            }

            //set the stage's size to match the grid, and ensure that the tableContainer widths/heights reflect the variables above
            //TweenLite.set(_stage, { height: gridRows * gridCellHeight + 1, width: gridColumns * gridCellWidth + 1 });
        }

        /**
        * STAGE END
        */

        /**
       * DRAG DROP START
       */

        function initDragNDrop() {

            $.each($('.drag-element'), function (i, val) {

                var _target = $(val);

                _target.mousedown(OnMouseDown);
                //_target.mouseup(OnMouseUp);

            })
        }

        function OnMouseDown(evt) {

            console.log('mouse down');
            var _target = $(evt.currentTarget);
            _target.bind('dragstart', OnDragStart);

            attachGridCellEvents();
        }

        function OnDragStart(event) {

            currentAction = 'addItem';

            var target = $(this);
            var w = target.data('shape-w');
            var h = target.data('shape-h');
            var sh = target.attr('name');
            var parent = target.attr('data-parent');

            $('#stage-grid-live')
                .find('.stage-board-field-highlight')
                .css({
                    width: (gridCellWidth * w),
                    height: (gridCellHeight * h)
                });

            var newId = getCurrentId() + 1;

            draggedObj = null;
            draggedObj = {
                id: newId,
                x: 0,
                y: 0,
                w: w,
                h: h,
                sh: sh
            };
        }

        function OnDragOver(evt) {

            if (evt.originalEvent.preventDefault) {
                evt.originalEvent.preventDefault();
            }

            evt.originalEvent.dataTransfer.dropEffect = 'move';

            return false;
        }

        function OnDragEnter(evt) {

            if (evt.originalEvent.preventDefault) {
                evt.originalEvent.preventDefault();
            }

            currentAction = 'drag';

            var currentField = $(evt.currentTarget);
            currentField.addClass('board-highlight-over');

            var _gridPos = {
                x: currentField[0].offsetLeft,
                y: currentField[0].offsetTop
            };

            draggedObj.x = _gridPos.x;
            draggedObj.y = _gridPos.y;
            draggedObj.r = 0;
            draggedObj.tox = 0;
            draggedObj.toy = 0;
        }

        function OnDragLeave(evt) {

            var _currentField = $(evt.currentTarget);
            _currentField.removeClass('board-highlight-over');
        }

        function OnDragDrop(evt) {

            detachGridCellEvents();

            var _currentField = $(event.currentTarget);
            _currentField.removeClass('board-highlight-over');

            if (evt.originalEvent.preventDefault) {
                evt.originalEvent.preventDefault(); // stops the browser from redirecting.
            }

            //get freshly created item container
            var _currentItem = createStageItem(
                draggedObj.id,
                draggedObj.x,
                draggedObj.y,
                draggedObj.r,
                draggedObj.tox,
                draggedObj.toy,
                draggedObj.w,
                draggedObj.h,
                draggedObj.sh);

            return _currentItem;
        }

        function OnDragEnd(evt) {

            detachGridCellEvents();

            var _currentField = $(evt.currentTarget);
            _currentField.removeClass('board-highlight-over');

        }

        function getCurrentId() {

            var _a = 0;

            $.each($('.item-box'), function (i, val) {

                _a = $($('.item-box')[i]).data('box-id');
            });

            return _a;
        }

        function attachGridCellEvents() {

            $.each($('.stage-board-field-highlight'), function (i, val) {

                var _target = $(val);
                //$(this).unbind('mousedown', this);
                _target.bind('dragover', OnDragOver);
                _target.bind('dragenter', OnDragEnter);
                _target.bind('dragleave', OnDragLeave);
                _target.bind('drop', OnDragDrop);
                _target.bind('dragend', OnDragEnd);
            })
        }

        function detachGridCellEvents() {

            $.each($('.stage-board-field-highlight'), function (i, val) {

                var _target = $(val);
                //$(this).unbind('mousedown', this);
                _target.unbind('dragover', OnDragOver);
                _target.unbind('dragenter', OnDragEnter);
                _target.unbind('dragleave', OnDragLeave);
                _target.unbind('drop', OnDragDrop);
                _target.unbind('dragend', OnDragEnd);
            })
        }
        /**
       * DRAG DROP END
       */

        /**
       * CREATE STAGE ITEM START
       */
        function createStageItem(id, x, y, r, tox, toy, w, h, sh) {

            var _stageItemsContainer = $('#stage-items-container');

            var _item = $(
                "<div>" +
                "<div class='shape-rotate-btn shape-button' data-btn-r='" + (r * (-1)) + "'>" +
                "<div class='shape-rotate-inv-btn'/>" +
                "<i class='material-icons shape-rotate-inv-icon'>rotate_right</i>" +
                "</div>" +
                "<div class='shape-drag-btn shape-button' data-btn-r='" + (r * (-1)) + "'>" +
                "<div class='shape-drag-inv-btn'/>" +
                "<i class='material-icons shape-drag-inv-icon'>drag_handle</i>" +
                "</div>" +
                "<div class='shape-delete-btn shape-button' data-btn-r='" + (r * (-1)) + "'>" +
                "<div class='shape-delete-inv-btn'/>" +
                "<i class='material-icons shape-delete-inv-icon'>delete</i>" +
                "</div>" +
                "<div class='shape-resize-btn shape-button' data-btn-r='" + (r * (-1)) + "'>" +
                "<div class='shape-resize-inv-btn'/>" +
                "<i class='material-icons shape-resize-inv-icon'>photo_size_select_small</i>" +
                "</div>" +
                "</div>"
            ).
                attr('class', 'item-box').
                attr('data-box-id', id).
                attr('data-box-x', x).
                attr('data-box-y', y).
                attr('data-box-r', r).
                attr('data-box-tox', tox).
                attr('data-box-toy', toy).
                attr('data-box-w', w).
                attr('data-box-h', h).
                attr('data-box-shape', sh).
                attr('data-box-selected', false).
                attr('data-parent', 'stage').
                css({
                    position: 'absolute',
                    width: (gridCellWidth) * w,
                    'max-width': (gridCellWidth + 1) * w,
                    height: (gridCellHeight) * h,
                    'max-height': (gridCellHeight + 1) * h
                }).
                appendTo(_stageItemsContainer);

            var _newOriginX = (_item.data('box-w') * gridCellWidth) * 0.5;
            var _newOriginY = (_item.data('box-h') * gridCellHeight) * 0.5;

            //if (_item.width() > _item.height()) {
            //    _newOriginX = (_item.data('box-w') * gridCellWidth) - (gridCellWidth * 0.5);
            //    _newOriginY = (_item.data('box-h') * gridCellHeight) - (gridCellHeight * 0.5);
            //}

            createRegularShapeRoom()
                .appendTo(_item);


            TweenLite.set(_item, { transformOrigin: "" + _newOriginX + "px " + _newOriginY + "px" });
            TweenMax.set(_item, { rotation: r });

            //TweenMax.set($('.sp-shape-rotate-ico'), { rotation: (360 - r) });
            //TweenMax.set($('.sp-shape-drag-ico'), { rotation: (360 - r) });
            //TweenMax.set($('.sp-shape-delete-ico'), { rotation: (360 - r) });

            _item.attr('data-box-tox', _newOriginX);
            _item.attr('data-box-toy', _newOriginY);

            removeDuplicate('.item-box');

            //setup item container on stage
            TweenLite.from(_item, 0.3, {
                scaleX: 0,
                scaleY: 0,
                onComplete: initItem,
                onCompleteParams: [_item]
            });

            TweenLite.to(_item, 0, { x: x, y: y });

            //if (getUrlParameter('action') == "edit") {
            //    turnOff(currentTableNum++);
            //}

            return _item;
        }

        function initItem(newItem) {

            var _target = $(newItem);

            var _dragBtn = _target.find('.shape-drag-btn');
            var _rotateBtn = _target.find('.shape-rotate-btn');
            var _deleteBtn = _target.find('.shape-delete-btn');
            var _resizeBtn = _target.find('.shape-resize-btn');

            _dragBtn.mousedown(onDragBtnDown);
            _dragBtn.mouseup(onDragBtnUp);
            _dragBtn.mouseleave(onDragBtnUp);

            _rotateBtn.mousedown(onRotateBtnDown);
            _rotateBtn.mouseup(onRotateBtnUp);
            _rotateBtn.mouseleave(onRotateBtnUp);

            _deleteBtn.click(onDeleteBtnClick)

            _target.click(selectTable);

            //$('#stage-grid-live')
            //    .find('.stage-board-field-highlight')
            //    .css({
            //        width: (gridCellWidth),
            //        height: (gridCellHeight)
            //    });
        };

        function createRegularShapeRoom() {

            var _w = (gridCellWidth * draggedObj.w) - (paddingLeft * 2);
            var _h = (gridCellHeight * draggedObj.h) - (paddingTop * 2);

            var _itemBgnd = $("<div/>").
                attr('class', 'item-bgnd ' + draggedObj.sh).
                css({
                    width: _w,
                    height: _h
                })

            return _itemBgnd;
        };

        function removeDuplicate(selector) {

            var arr = {};

            $.each($(selector), function (i, val) {

                var id = $(this).attr('data-box-id');

                if (arr[id]) {

                    $(this).remove();
                }
                else {

                    arr[id] = true;
                }
            });
        }

        /**
        * CREATE STAGE ITEM END
        */

        var prevItem = null

        function selectTable(evt) {

            selectedItem = $(evt.currentTarget);
            selectedItem.attr('data-box-selected', true);
            TweenMax.set(selectedItem, { zIndex: 9999 });

            if (prevItem != null)
            {
                prevItem.attr('data-box-selected', false);
                TweenMax.set(prevItem, { zIndex: 0 });
            }

            prevItem = selectedItem
        }

        /*
            SHAPE BUTTONS: DELETE
        */
        function onDeleteBtnClick(evt) {
            var _item = $(evt.currentTarget).parent();

            //if (_target.parent().width() > _target.parent().height()) {
            //    _newOriginX = (_target.parent().data('box-w') * gridWidth) * 0.5;
            //    _newOriginY = (_target.parent().data('box-h') * gridHeight)  * 0.5;

            //    TweenLite.set(_target.parent(), { transformOrigin: "" + _newOriginX + "px " + _newOriginY + "px" });

            //    _target.parent().attr('data-box-tox', _newOriginX);
            //    _target.parent().attr('data-box-toy', _newOriginY);
            //}

            TweenMax.to(_item, 0.1, {
                scaleX: 0,
                scaleY: 0,
                onComplete: function () {

                    _item.remove();
                }
            })
        }

        /**
       * SHAPE BUTTONS: DRAG START
       */
        function onDragBtnDown(evt) {

            if (!dragIsOn) {

                dragIsOn = true;

                var btn = $(evt.target);
                var invBtn = btn.parent().find('.shape-drag-inv-btn');
                var icon = btn.find('.shape-drag-inv-icon')

                TweenLite.set(invBtn, { scaleX: 5, scaleY: 5 })

                var draggedItem = btn.parent().parent();
                createDraggableStageItem(draggedItem, actionsOfDraggable.drag);
                console.log('dragIsOn:' + dragIsOn)
            }

        }

        function onDragBtnUp(evt) {

            if (dragIsOn) {

                dragIsOn = false;

                var btn = $(evt.target);
                var invBtn = btn.parent().find('.shape-drag-inv-btn');
                var icon = btn.find('.shape-drag-inv-icon')

                TweenLite.set(invBtn, { scaleX: 1, scaleY: 1 })

                var draggedItem = btn.parent().parent();

                if (currentDraggable != null) {
                    draggedItem.attr('data-box-x', Math.ceil(currentDraggable[0].x));
                    draggedItem.attr('data-box-y', Math.ceil(currentDraggable[0].y));

                    //currentDraggable[0].kill();
                    currentDraggable[0].disable();
                }

                console.log('dragIsOn:' + dragIsOn)
                console.log(currentDraggable)
            }
        }

        /**
        * SHAPE BUTTONS:DRAG END
        */

        /**
        * SHAPE BUTTONS: DRAG START
        */
        function onRotateBtnDown(evt) {
            if (!rotateIsOn) {

                rotateIsOn = true;

                var btn = $(evt.target);
                var invBtn = btn.parent().find('.shape-rotate-inv-btn');
                var icon = btn.find('.shape-rotate-inv-icon')

                TweenLite.set(invBtn, { scaleX: 5, scaleY: 5 })

                var draggedItem = btn.parent().parent();
                createDraggableStageItem(draggedItem, actionsOfDraggable.rotate);
                console.log('rotateIsOn:' + rotateIsOn)
            }
        }

        function onRotateBtnUp(evt) {

            if (rotateIsOn) {

                rotateIsOn = false;
                var btn = $(evt.target);
                var invBtn = btn.parent().find('.shape-rotate-inv-btn');
                var icon = btn.find('.shape-rotate-inv-icon')

                TweenLite.set(invBtn, { scaleX: 1, scaleY: 1 })

                var draggedItem = btn.parent().parent();

                draggedItem.attr('data-box-r', currentDraggable[0].rotation);

                if (currentDraggable != null) {
                    
                    //currentDraggable[0].kill();
                   // currentDraggable[0].disable();

                    TweenMax.to(draggedItem, 0.2, {
                        shortRotation: draggedItem.attr('data-box-r')
                        //onComplete: assignBtnsListeners,
                        //onCompleteParams: [_invBtn]
                    });
                }

                console.log('rotateIsOn:' + rotateIsOn)
                console.log(currentDraggable)

            }
        }

        /**
        * SHAPE BUTTONS:DRAG END
        */

        /**
        * CREATE DRAGGABLE STAGE ITEM START
        */

        function createDraggableStageItem(item, actionType) {

            var _stage = $('#stage');
            var _snap = true;
            var _liveSnap = false;
            var _throwProp = true;
            var _rotationSnap = 90;

            switch (actionType) {
                //Drag Me
                case actionsOfDraggable.drag:

                    currentDraggable = Draggable.create(item, {
                        bounds: _stage,
                        autoScroll: 1,
                        edgeResistance: 0.65,
                        type: actionType,
                        throwProps: _throwProp,
                        liveSnap: _liveSnap,
                        snap: {

                            x: function (endValue) {
                                return (_snap || _liveSnap) ? Math.round(endValue / gridCellWidth) * gridCellWidth : endValue;
                            },
                            y: function (endValue) {
                                return (_snap || _liveSnap) ? Math.round(endValue / gridCellHeight) * gridCellHeight : endValue;
                            }
                        },
                        //onPress: function (evt) {
                        //    evt.stopPropagation(); // cancel drag
                        //},
                        onDrag: function () { },
                        onThrowComplete: function () {

                            var _item = $(item);
                            _item.attr('data-box-x', Math.ceil(this.x));
                            _item.attr('data-box-y', Math.ceil(this.y));
                            //this.disable();

                        }
                    });


                    break;

                case actionsOfDraggable.rotate:

                    currentDraggable = Draggable.create(item, {
                        type: "rotation",
                        throwProps: _throwProp,
                        snap: function (endValue) {

                            /*this function gets called when the mouse/finger is released and
                            it plots where rotation should normally end and we can alter that
                            value and return a new one instead. This gives us an easy way to
                            apply custom snapping behavior with any logic we want. In this case,
                            just make sure the end value snaps to 90-degree increments but only
                            when the "snap" checkbox is selected.*/
                            return Math.round(endValue / _rotationSnap) * _rotationSnap;
                        },
                        //onPress: function (evt) {
                        //    evt.stopPropagation(); // cancel drag
                        //},
                        onDrag: setNumberRotation,
                        onThrowUpdate: setNumberRotation,
                        onThrowComplete: function (evt) {

                            var _item = $(item);
                            _item.attr('data-box-r', (this.rotation % 360));
                            //this.disable();

                            if (currentDraggable != null)
                                currentDraggable[0].kill();
                        }
                    });
                    break;
            }

        }

        function setNumberRotation(evt) {

            var item = $(this.target);
            $(item).attr('data-box-r', (this.rotation % 360));

            var _angle = this.rotation;
            TweenLite.set(item.find('.shape-button'), { rotation: -(_angle % 360)  });
        }

        /**
        * CREATE DRAGGABLE STAGE ITEM END
        */


        /**
        * SHAPES PANEL START
        */
        function shapeListInit() {

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
                    primaryContentX: 20,
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
        var draggableObj = Draggable.create($("#stage-container"), {
            type: "scroll",
            edgeResistance: 1,
            throwProps: true,
            lockAxis: true
        });
        Draggable.get("#stage-container").disable();
        /**
        * CREATE DRAGGABLE STAGE END
        */

        /**
        * ZOOM START
        */
        /*MOUSE WHEEL*/
        $('#stage-container').bind('wheel mousewheel', function (evt) {

            if (zoomMouse) {
                var delta;

                if (evt.originalEvent.wheelDelta !== undefined)
                    delta = evt.originalEvent.wheelDelta;
                else
                    delta = evt.originalEvent.deltaY * -1;

                if (delta > 0) {
                    stageScaleNum += 0.1;
                }
                else {
                    stageScaleNum -= 0.1;
                }

                ZoomStage();

                document.querySelector('#zoom-slider').MaterialSlider.change((stageScaleNum - 1) * 10);
                //$("#zoom-slider").get(0).MaterialTextfield.change((stageScaleNum - 1) * 10);
            }
        });
        /*SLIDER*/
        $('#zoom-slider').on('input', function () {

            stageScaleNum = (this.value * 0.1) + 1;
            ZoomStage();
        });
        /*ZOOM IN BTN*/
        $('#zoom-in-floor-btn').click(function () {

            stageScaleNum += 0.1;

            ZoomStage();
            document.querySelector('#zoom-slider').MaterialSlider.change((stageScaleNum - 1) * 10);
        })
        /*ZOOM OUT BTN*/
        $('#zoom-out-floor-btn').click(function () {

            stageScaleNum -= 0.1;

            ZoomStage();
            document.querySelector('#zoom-slider').MaterialSlider.change((stageScaleNum - 1) * 10);
        })
        /*ZOOM RESET BTN*/
        $('#zoom-reset-floor-btn').click(function () {

            stageScaleNum = 1;

            ZoomStage();
            document.querySelector('#zoom-slider').MaterialSlider.change((stageScaleNum - 1) * 10);
        });
        /*ZOOM ZOOM*/
        function ZoomStage() {

            var stage = $('#stage');
            var stageContainer = $('#stage-container');

            //TweenLite.killTweensOf(room);
            //TweenLite.killTweensOf(roomContainer);

            if (stageScaleNum < stageScaleNumMin) {
                stageScaleNum = 0.2;
            }
            if (stageScaleNum > stageScaleNumMax) {
                stageScaleNum = 2;
            }

            TweenMax.to(stage, 0.3, {
                scaleX: stageScaleNum,
                scaleY: stageScaleNum,
            });

            var posX = (stageContainer.width() / 2 - stage.width() / 2)
            var stageWidthAfterScale = stage.width() * stageScaleNum;

            var posY = (stageContainer.height() / 2 - stage.height() / 2)
            var stageHeightAfterScale = stage.height() * stageScaleNum;

            //First for horizontal scale scroll issue
            //check if scaled room width is bigger than room conatiner
            //if true align to left
            if (stageWidthAfterScale >= stageContainer.width()) {
                TweenMax.set(stage, {
                    transformOrigin: "0 50%",
                    x: 0,
                    y: posY
                });

                //then check if scaled room height is bigger than room conatiner 
                //and align to top
                if (stageHeightAfterScale >= stageContainer.height()) {
                    TweenMax.set(stage, {
                        transformOrigin: "0% 0%",
                        x: 0,
                        y: 0
                    });
                }

            }
            //for vertical scale scroll issue
            //check if scaled room height is bigger than room conatiner 
            //if true align to top
            else if (stageHeightAfterScale >= stageContainer.height()) {
                TweenMax.set(stage, {
                    transformOrigin: "50% 0%",
                    x: posX,
                    y: 0
                });

                //then check if scaled room width is bigger than room conatiner 
                //and align to left
                if (stageWidthAfterScale >= stageContainer.width()) {
                    TweenMax.set(stage, {
                        transformOrigin: "0 0",
                        x: 0,
                        y: 0
                    });
                }

            }
            //otherwise appply regular scale with centerd point
            else {
                TweenMax.set(stage, {
                    transformOrigin: "50% 50%",
                    x: posX,
                    y: posY
                });
            }
        }
        /**
         * ZOOM END
         */

        /**
          * ON KEY UP/DOWN START
          */

        $(document).on('keydown', OnKeyDown);
        function OnKeyDown(evt) {

            var stageContainer = $("#stage-container");

            //zoom with "Z"
            if (evt.keyCode === 90) {
                zoomMouse = true;

                stageContainer.css({ "overflow-x": "hidden" });
                stageContainer.css({ "overflow-y": "hidden" });
            }

            //drag stage with "X"
            if (evt.keyCode === 88) {

                //if ($('#stage-blocker').length === 0)
                //    $('<div>')
                //        .attr('id', 'room-blocker').attr('class', 'room-blocker-inv').appendTo(room);

                Draggable.get("#stage-container").enable();
                //Draggable.get("#sp-seating-container").applyBounds({ top: 0, left: 0, width: roomWidthOrg * stageScaleNum, height: roomHeightOrg * stageScaleNum });
            }
        }

        $(document).on('keyup', OnKeyUp);
        function OnKeyUp(evt) {

            var stageContainer = $("#stage-container");

            //zoom with "Z"
            if (evt.keyCode === 90) {
                zoomMouse = false;

                $("#stage-container").css({ "overflow-x": "auto" });
                $("#stage-container").css({ "overflow-y": "auto" });
            }

            //drag stage with "X"
            if (evt.keyCode === 88) {

                if ($('#stage-blocker').length > 0)
                    $('#stage-blocker').remove();

                Draggable.get("#stage-container").disable();

            }
        }

        /**
          * ON KEY UP/DOWN END
          */

        function RefreshSeatingPlanScreen() {
            UpdateProps();
        }

        function UpdateProps() {
            var toolbarHeight = $("#designer-toolbar").height();
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            $("#shapes-panel").height(
                windowHeight - toolbarHeight
            )

            $("#stage-container").height(
                windowHeight - toolbarHeight
            )


            var parentHeight = $("#stage-container").height();
            var parentWidth = $("#stage-container").width();

            if ($("#stage").height() <= $("#stage-container").height()) {

                var posY = (parentHeight / 2 - $("#stage").height() / 2);
                TweenLite.to($("#stage"), 0, { y: posY })
            }
            else {
                TweenLite.to($("#stage"), 0, { y: 0 })
            }

            if ($("#stage").width() <= $("#stage-container").width()) {
                var posX = (parentWidth / 2 - $("#stage").width() / 2)
                TweenLite.to($("#stage"), 0, { x: posX })
            }
            else {
                TweenLite.to($("#stage"), 0, { x: 0 })
            }

            //if ($("#stage").width() <= $("#stage-container").width()) {
            //$("#stage").offset({ right: posX });
            //}
        }
    });
})()