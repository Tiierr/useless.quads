import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

import Quad from './tools/quad';
import Circle from './tools/circle';
import {findImage, getRandom} from "./tools/common";
import Upload from "./component/Upload";
import Error from "./component/Error";
import Bulb from "./component/Bulb";
import onEvent from "./tools/event";
import Save from "./component/Save";

function App() {
  const [errorVisible, setError] = useState(false);
  const images: Array<string> = findImage();

  const dotRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxSize = 512;
  const [quadImage, setQuadImage] = useState<string>(getRandom(images));
    useEffect(() => {
    let context = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
    let img = new Image();
    img.onload = function(){
      context.drawImage(img, 0, 0, maxSize, maxSize);
      const svg = d3.select(dotRef.current)
          .append("svg")
          .attr("viewBox", `0 0 ${maxSize} ${maxSize}`)
          .style("display", "block");

      const quad = new Quad(0, 0, maxSize, maxSize, null, context);
      Circle(svg, [quad], true);
      // start listening event
      onEvent(quad, svg);
    };
    img.src = quadImage;
  }, [quadImage]);

  return (
      <>
        {!errorVisible &&
        <div className="center">
          <div className="image-icon">
            <Upload setImage={setQuadImage} setError={setError}/>
            <Save size={maxSize * 2} />
          </div>
          <Bulb />
          <canvas height={maxSize} width={maxSize} ref={canvasRef} style={{display: "none"}}/>
          {quadImage && <div className="dot" ref={dotRef}>
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
