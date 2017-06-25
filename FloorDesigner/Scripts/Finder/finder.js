(function (roomsCfg) {
    $(document).ready(function () {

        //GLOBAL VARS START
        var debugMode = debugCfg.DEBUG;
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
        //---rooms---\\
        var gridCellWidth = roomsCfg.CELL_WIDTH;
        var gridCellHeight = roomsCfg.CELL_HEIGHT;
        var shapeSizes = roomsCfg.SHAPES_SIZES;
        var paddingLeft = roomsCfg.SHAPE_CFG.PADDING_LEFT;
        var paddingTop = roomsCfg.SHAPE_CFG.PADDING_TOP;
        var itemBorderSize = roomsCfg.SHAPE_CFG.BORDER_SIZE;
        var loadedItems = [];
        var highlightRoomColor = "#448aff";
        //GLOBAL VARS END

        initApp();

        function initApp() {

            $(window).resize(function () {
                RefreshSeatingPlanScreen();
            });

            RefreshSeatingPlanScreen();

            initSearchPanel();
            initToolbar();
            initFloor();
        }

        function initFloor() {

            loadedItems = [];

            var action = "/api/floors";
            var data = { id: 1 };

            $.ajax({
                type: "GET",
                url: action,
                data: data,
                cache: false,
                success: function (response) {

                    floorCfg = response;
                    loadedItems = floorCfg.rooms;

                    stageInit();
                    RefreshSeatingPlanScreen();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr, ajaxOptions, thrownError);
                }
            });
        }

        function stageInit() {

            $('#stage').width(floorCfg.width * gridCellWidth);
            $('#stage').height(floorCfg.height * gridCellHeight);

            $('#stage-items-container').width(floorCfg.width * gridCellWidth);
            $('#stage-items-container').height(floorCfg.height * gridCellHeight);

            var img = $('#stage').find('img');
            img.attr('src', floorCfg.image);
            img.width(floorCfg.width * gridCellWidth);
            img.height(floorCfg.height * gridCellHeight);

            //  createGrid(gridCellWidth, gridCellHeight, floorCfg.width, floorCfg.height);

            loadItems();


        }

        function loadItems() {

            if (loadedItems.length > 0) {
                $.each(loadedItems, function (i, val) {

                    var id = loadedItems[i].id;
                    var shape = loadedItems[i].shape;
                    var x = loadedItems[i].xpos * gridCellWidth;
                    var y = loadedItems[i].ypos * gridCellHeight;
                    var r = loadedItems[i].rotation;

                    var shapeSizeTableObj = findValueByKey(shapeSizes, shape);

                    draggedObj = {};
                    draggedObj.id = id;
                    draggedObj.sh = shape;
                    draggedObj.x = x;
                    draggedObj.y = y;
                    draggedObj.r = r;
                    draggedObj.w = shapeSizeTableObj.w;
                    draggedObj.h = shapeSizeTableObj.h;
                    draggedObj.tox = shapeSizeTableObj.t.x;
                    draggedObj.toy = shapeSizeTableObj.t.y;

                    var currentItem = createStageItem(
                        draggedObj.id,
                        draggedObj.x,
                        draggedObj.y,
                        draggedObj.r,
                        draggedObj.tox,
                        draggedObj.toy,
                        draggedObj.w,
                        draggedObj.h,
                        draggedObj.sh);
                });
            }
        }

        function createStageItem(id, x, y, r, tox, toy, w, h, sh) {

            var stageItemsContainer = $('#stage-items-container');

            var item = $(
                "<div/>"
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
                attr('data-box-bgnd-color', '').
                attr('data-parent', 'stage').
                css({
                    position: 'absolute',
                    width: (gridCellWidth) * w,
                    'max-width': (gridCellWidth + 1) * w,
                    height: (gridCellHeight) * h,
                    'max-height': (gridCellHeight + 1) * h
                }).
                appendTo(stageItemsContainer);

            if (item.data('box-shape') === "shape-room-l-3x2") {
                createLShapeRoom()
                    .appendTo(item);
            }
            else {
                createRegularShapeRoom()
                    .appendTo(item);
            }

            item.attr('data-box-bgnd-color', item.find('.shape-part').css('backgroundColor'));

            var newOriginX = (item.data('box-w') * gridCellWidth) * 0.5;
            var newOriginY = (item.data('box-h') * gridCellHeight) * 0.5;

            if (item.width() > item.height()) {
                newOriginX = (item.data('box-w') * gridCellWidth) - (gridCellWidth * 0.5);
                newOriginY = (item.data('box-h') * gridCellHeight) - (gridCellHeight * 0.5);
            }

            TweenLite.set(item, { transformOrigin: "" + newOriginX + "px " + newOriginY + "px" });

            TweenLite.set(item, { rotation: r });
            TweenLite.set(item.find('.shape-button'), { rotation: (360 - r) });

            item.attr('data-box-tox', newOriginX);
            item.attr('data-box-toy', newOriginY);

            removeDuplicate('.item-box');

            //setup item container on stage
            TweenLite.from(item, 0, {
                scaleX: 0,
                scaleY: 0,
                onComplete: initItem,
                onCompleteParams: [item]
            });

            TweenLite.to(item, 0, { x: x, y: y });

            return item;
        }

        function findValueByKey(array, key) {

            for (var i = 0; i < array.length; i++) {

                if (array[i][key]) {

                    return array[i][key];
                }
            }
            return null;
        }

        function createRegularShapeRoom() {

            var w = (gridCellWidth * draggedObj.w) - (paddingLeft * 2);
            var h = (gridCellHeight * draggedObj.h) - (paddingTop * 2);

            var itemBgnd = $("<div/>").
                attr('class', 'item-bgnd shape-part ' + draggedObj.sh).
                css({
                    width: w,
                    height: h
                })

            return itemBgnd;
        };

        function createLShapeRoom() {

            var w = (gridCellWidth * draggedObj.w) - (paddingLeft * 2);
            var h = (gridCellHeight * draggedObj.h) - (paddingTop * 2);

            var itemBgnd = $("<div><div class='l-shape-top shape-part'/><div class='l-shape-bottom shape-part'/></div>").
                attr('class', 'item-bgnd ' + draggedObj.sh).
                css({
                    width: w,
                    height: h
                })


            var top = itemBgnd.
                find('.l-shape-top').
                css({
                    width: w / draggedObj.w + (itemBorderSize + 1),
                    height: h / draggedObj.h
                });

            var bottom = itemBgnd.
                find('.l-shape-bottom').
                css({
                    width: w - gridCellWidth,
                    height: h
                });

            return itemBgnd;
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

        function initItem(newItem) {

            //var item = $(newItem);

        };

        function initSearchPanel() {

            $("#search-room-form").submit(function (e) {
                return false;
            });

            $('#find-room-btn').click(onFindRoomClick);

            function onFindRoomClick(evt) {

                var idsArray = [];

                $('.item-box').each(function (i, val) {

                    TweenLite.set($(this).find('.shape-part'),
                        {
                            backgroundColor: this.dataset.boxBgndColor
                        });

                    idsArray.push(this.dataset.boxId)
                });

                var searchedItemId = idsArray[Math.floor(Math.random() * idsArray.length)];
                var searchedItem = $('.item-box[data-box-id=' + searchedItemId + ']');

                TweenMax.to(searchedItem.find('.shape-part'), 0.3, {

                    backgroundColor: highlightRoomColor,
                    repeat: 6,
                    yoyo: true,
                    onComplete: function () {

                    }
                });

                if (debugMode) {
                    console.log(searchedItemId)
                    console.log(searchedItem)
                }
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
})(roomsCfg);