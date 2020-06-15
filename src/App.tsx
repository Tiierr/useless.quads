import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

import Quad from './tools/quad';
import Circle from './tools/circle';
import {findImage, getRandom} from "./tools/common";


function App() {

  const images: Array<string> = findImage();

  const dotRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = 1024;
  const height = 1024;

  // todo: support upload picture
  // const [quadImage] = useState<string>(getRandom(images));

  const quadImage = getRandom(images);
  useEffect(() => {
    if (!canvasRef.current) return;

    // @ts-ignore
    let context: CanvasRenderingContext2D = canvasRef.current.getContext('2d');

    let img = new Image();
    img.onload = function(){
      context.drawImage(img, 0, 0, height, width);
      const svg = d3.select(dotRef.current)
          .append("svg")
          .attr("viewBox", `0 0 ${height} ${width}`)
          .style("display", "block");

      const quad = new Quad(0, 0, width, width, null, context);
      if (quad.e > 30) {
        document.body.style.backgroundColor = "#FFFFFB";
      }

      Circle(svg, [quad], true);
    };
    img.src = quadImage;
  }, [quadImage]);

  return (
    <div className="center">
      <div className="cont">
        <div className="dot" ref={dotRef}>
          <canvas height={height} width={width} ref={canvasRef} style={{display: "none"}}/>
        </div>
      </div>
    </div>
  );
}

export default App;
