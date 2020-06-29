import {checkSplit, colorFromHistogram, computeHistogram} from './calculate';
import * as d3 from "d3";
import Circle from "./circle";

const sum = function (items: Array<Quad | null>, prop: string){
    return items.reduce( function(a, b){
        // @ts-ignore
        return prop === 'e' ?  a + b[prop] :  a + b[prop]()
    }, 0);
};

class Quad {
    x: number;
    y: number;
    w: number;
    h: number;
    e: number;
    color: string;
    parent: null | Quad;
    node: null | HTMLElement;
    point: Array<number>;
    children: Array<Quad>;
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
        this.point = [x + h/2, y + w/2];
        this.ctx = imageContext;
        this.color = `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).substring(1)}`;
        this.score = error * Math.pow(w * h, 0.25);
        this.e = error;
        this.node = null;
        this.parent = p;
        this.children = [];
    }

    isSplitable(): boolean {
        return this.node !== null && this.split() !== null
    }

    averageError(): number{
        const quads = this.split();
        if (quads == null) {
            return 0;
        } else {
            return sum(quads, 'e') / 4;
        }
    }
    averageChildError(): number{
        const quads = this.split();
        if (quads == null) {
            return 0;
        } else {
            return sum(quads, 'averageError') / 4;
        }
    }
    split(): Array<Quad> | null {
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
    splitToCircle(svgNode: any){
        if (!this.split()) return;
        d3.select(this.node).remove();
        delete this.node;
        Circle(svgNode, this.children, false);
    }
}


function getAllLeaf (quads: Array<Quad>) {
    let result: Array<Quad> = [];
    function getLeaf (quads: Array<Quad>) {
        quads.forEach((item: Quad) => {
            let childrenLeaf = item.split();
            // @ts-ignore
            item.children = childrenLeaf;
            if (childrenLeaf != null) {
                getLeaf(childrenLeaf)
            } else {
                result[item.x/4 * 128 + item.y/4] = item;
            }
        })
    }
    getLeaf(quads);
    return result;
}

export default Quad;
export {
    getAllLeaf
}
