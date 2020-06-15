import {checkSplit, computeHistogram, colorFromHistogram} from './calculate'

class Quad {
    x: number;
    y: number;
    w: number;
    h: number;
    e: number;
    color: string;
    parent: null | Quad;
    node: null | HTMLElement;
    private ctx: CanvasRenderingContext2D;
    private score: number;


    //x: 将要被提取的图像数据矩形区域的左上角 x 坐标。
    //y: 将要被提取的图像数据矩形区域的左上角 y 坐标。
    //w: 将要被提取的图像数据矩形区域的宽度。
    //h: 将要被提取的图像数据矩形区域的高度。

    // error: rgb -> gray
    constructor(x: number, y: number, w: number, h: number, p: null | Quad, imageContext: CanvasRenderingContext2D) {
        const [r, g, b, error] = colorFromHistogram(computeHistogram(imageContext, x, y, w, h));
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ctx = imageContext;
        this.color = `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).substring(1)}`;
        this.score = error * Math.pow(w * h, 0.25);
        this.e = error;
        this.node = null;
        this.parent = p;
    }

    split() {
        const dx = this.w / 2, x1 = this.x, x2 = this.x + dx;
        const dy = this.h / 2, y1 = this.y, y2 = this.y + dy;

        if (!checkSplit([dx, dy])) {
            return null;
        }

        return [
            new Quad(x1, y1, dx, dy, this, this.ctx),
            new Quad(x2, y1, dx, dy, this, this.ctx),
            new Quad(x1, y2, dx, dy, this, this.ctx),
            new Quad(x2, y2, dx, dy, this, this.ctx)
        ];
    }
}


export default Quad;
