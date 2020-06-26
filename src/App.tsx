import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

import Quad from './tools/quad';
import Circle from './tools/circle';
import {findImage, getRandom} from "./tools/common";
import Upload from "./component/upload";
import Error from "./component/error";
import Bulb from "./component/bulb";

function App() {
  const [errorVisible, setError] = useState(false);
  const images: Array<string> = findImage();

  const dotRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = 512;
  const height = 512;

  const light = "#fffffb", dark = "#222";

  const [quadImage, setQuadImage] = useState<string>(getRandom(images));
  const [backgroundColor, setBGColor] = useState(light);
  const [bulb, setBulb] = useState(false);


  useEffect(() => {
    setBGColor(bulb ? dark : light)
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor, bulb])

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
      Circle(svg, [quad], true);
    };
    img.src = quadImage;
  }, [quadImage]);

  return (
      <>
        {!errorVisible &&
        <div className="center">
          <Upload setImage={setQuadImage} setError={setError}/>
          <Bulb onSwitch={() => setBulb(!bulb)}/>
          {/*todo: fix display on iPad Browser*/}
          {quadImage && <div className="dot" ref={dotRef}>
            <canvas height={height} width={width} ref={canvasRef} style={{display: "none"}}/>
          </div>}
        </div>}
        {errorVisible && <Error title="Oops..." detail="Seems image too large"
                                onClose={() => {
                                  setQuadImage(getRandom(images));
                                  setError(false);
                                }}/>
        }
      </>
  );
}

export default App;
