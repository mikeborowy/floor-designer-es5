var roomsCfg = (function () {

    var cfg = {}
    cfg.CELL_WIDTH = 60;
    cfg.CELL_HEIGHT = 60;
    cfg.SHAPE_CFG = {
        PADDING_LEFT: 0,
        PADDING_TOP: 0,
        BORDER_SIZE: 3
    }
    cfg.SHAPES_SIZES = [
        {
            "shape-room-sqr-2x2":
            {
                w: 2,
                h: 2,
                t: {
                    x: this.CELL_WIDTH,
                    y: this.CELL_HEIGHT
                }
            }
        },
        {
            "shape-room-sqr-3x3":
            {
                w: 3,
                h: 3,
                t: {
                    x: (2 * this.CELL_WIDTH) - (this.CELL_WIDTH * 0.5),
                    y: (2 * this.CELL_HEIGHT) - (this.CELL_HEIGHT * 0.5)
                }
            }
        },
        {
            "shape-room-rct-3x2":
            {
                w: 3,
                h: 2,
                t: {
                    x: (3 * this.CELL_WIDTH) - (this.CELL_WIDTH * 0.5),
                    y: (2 * this.CELL_HEIGHT) - (this.CELL_HEIGHT * 0.5)
                }
            }
        },
        {
            "shape-room-l-3x2":
            {
                w: 3,
                h: 3,
                t: {
                    x: (3 * this.CELL_WIDTH) - (this.CELL_WIDTH * 0.5),
                    y: (2 * this.CELL_HEIGHT) - (this.CELL_HEIGHT * 0.5)
                }
            }
        }
    ];

    return cfg

})(roomsCfg || {});