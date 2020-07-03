import Quad from "./quad";

function colorFromHistogram(histogram: Uint32Array) {
    const [r, re] = weightedAverage(histogram.subarray(0, 256));
    const [g, ge] = weightedAverage(histogram.subarray(256, 512));
    const [b, be] = weightedAverage(histogram.subarray(512, 768));
    return [
        Math.round(r),
        Math.round(g),
        Math.round(b),
        re * 0.2989 + ge * 0.5870 + be * 0.1140
    ];
}

function weightedAverage(histogram: Uint32Array) {
    // 加权平均值 weighted average value
    let total = 0;
    let value = 0;
    for (let i = 0; i < 256; ++i) {
        total += histogram[i];
        value += histogram[i] * i;
    }
    value /= total;

    // 加权标准差 WEIGHTED STANDARD DEVIATION
    let error = 0;
    for (let i = 0; i < 256; ++i) error += (value - i) ** 2 * histogram[i];
    return [value, Math.sqrt(error / total)];
}

function computeHistogram(imageContext: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const {data} = imageContext.getImageData(x, y, w, h);
    const histogram = new Uint32Array(1024);
    // 将 RGBA 数组转化为直方图
    // R: 0 - 256
    // G: 256 - 512
    // B: 512 - 768
    // A: 768 - 1024
    for (let i = 0, n = data.length; i < n; i += 4) {
        ++histogram[0 * 256 + data[i + 0]];
        ++histogram[1 * 256 + data[i + 1]];
        ++histogram[2 * 256 + data[i + 2]];
        ++histogram[3 * 256 + data[i + 3]];
    }
    return histogram;
}

function checkSplit(args: Array<number>): boolean {
    return args.filter(x => x >= 4).length === args.length;
}

function reverseSquareArrayByStep(array: Array<Quad>, step: number){
    let b : Quad[] = [];
    for (let j = 0; j <= array.length; j += step * 2){
        b = b.concat(array.slice(j, j + step), array.slice(j + step, j + step * 2).reverse())
    }
    return b;
}

function sortQuadArray(quads: Quad[][]){
    for (let i = 0; i < quads.length; i++){
        let a = quads[i];
        a.sort((a, b) => a.y - b.y);
        quads[i] = reverseSquareArrayByStep(a, Math.sqrt(a.length));
    }
    return quads.flat();
}

function computeSplitQuad (quad: Quad) {
    let array2d: Quad[][] = [];
    for (let i = 1; i < 128; i *= 2) {
        array2d[Math.log2(i)] = [];
    }
    array2d[0] = [quad];
    let quads = quad.split() as Array<Quad>;
    quad.children = quads;
    function SplitQuad (quads: Array<Quad>) {
        quads.forEach((item: Quad) => {
            let childrenLeaf = item.split();
            // @ts-ignore
            item.children = childrenLeaf;
            if (childrenLeaf != null) {
                array2d[Math.log2(128) - Math.log2(item.w / 4)].push(item)
                SplitQuad(childrenLeaf)
            } else {
                return
            }
        })
    }
    SplitQuad(quads);
    return sortQuadArray(array2d);
}

export {
    colorFromHistogram,
    computeHistogram,
    checkSplit,
    computeSplitQuad
}
