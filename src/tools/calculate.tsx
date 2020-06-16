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
    return args.filter(x => x >= 16).length === args.length;
}


export {
    colorFromHistogram,
    computeHistogram,
    checkSplit
}
