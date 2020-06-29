import Quad, {getAllLeaf} from "./quad";
import * as d3 from "d3";

function flatPoint(point: Array<number>){
    if (isIOS()){
        point[0] -= 1;
        point[1] -= 1;
    }

    return Math.floor(point[0]/4) * 128 + Math.floor(point[1]/4);
}

function checkPoint(point: Array<number>): Boolean {
    return !(point[0] < 0 || point[0] > 512 || point[1] < 0 || point[1] > 512);
}

function isIOS(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /iPad|iPhone/.test(userAgent) && !window.MSStream;
}

function listen(svg: object, leafs: Array<Quad>) {
    // todo: calculate mouse point distance as split condition
    // @ts-ignore
    let point = d3.mouse(svg.node());
    if(!checkPoint(point)) return;
    let q = leafs[flatPoint(point)];
    if (!q) return;

    while (q && !q.isSplitable() && q.parent) {
        q = q.parent;
    }
    q.splitToCircle(svg);
}

function onEvent(quad: Quad, svg: object) {
    const quadChild = quad.split();
    if (!quadChild) return;

    quad.children = quadChild;
    let leafs =  getAllLeaf(quad.children);

    // @ts-ignore
    d3.select('svg').on('click', () => listen(svg, leafs));
    d3.select('svg').on('mousemove', () => listen(svg, leafs));
    d3.select('svg').on('touchmove', () => listen(svg, leafs));
    d3.select('svg').on('touchend', () => listen(svg, leafs));
    d3.select('svg').on('touchcancel', () => listen(svg, leafs));

}

export default onEvent;
