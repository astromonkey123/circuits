export class GraphContainer extends Container {
    constructor(id) {
        super(id);
        this.height_scale = 0;
        this.height_increment = 2;
        this.num_times = 1000;
        this.spacing = this.canvas.width / this.num_times;
        this.display_current = "";
    }

    updateScale(limit) {
        if (limit === 0) {
            this.height_scale = 1;
        } else if (limit < this.height_increment) {
            this.height_scale = 1 / ( Math.pow(2, Math.ceil( Math.log2( limit ) ) ) );
        } else {
            this.height_scale = 1 / ( Math.ceil( limit / this.height_increment ) * this.height_increment );
        }
    }
}