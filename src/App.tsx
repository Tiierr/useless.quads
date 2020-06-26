import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import { useLocalStorage } from "@rehooks/local-storage";

import Quad from './tools/quad';
import Circle from './tools/circle';
import {findImage, getRandom} from "./tools/common";
import Upload from "./component/upload";
import Error from "./component/error";
import Bulb from "./component/bulb";
import downloadIcon from "./static/svg/download.svg";

function App() {

  const [errorVisible, setError] = useState(false);
  const images: Array<string> = findImage();

  const dotRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saveCanvasRef = useRef<HTMLCanvasElement>(null);

  const width = 512 * 2;
  const height = 512 * 2;

  const light = "#fffffb", dark = "#222";

  const [quadImage, setQuadImage] = useState<string>(getRandom(images));

  const [backgroundColor, setBGColor] = useLocalStorage<string>("backgroundColor", light);
  const [bulb, setBulb] = useLocalStorage<boolean>("bulb", false);


  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor])


  useEffect(() => {
    setBGColor(bulb ? dark : light)
  }, [bulb, setBGColor])

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
  }, [quadImage, height, width]);


  function saveImage() {
    // @ts-ignore
    let html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        // @ts-ignore
        .node().parentNode.innerHTML;

    let canvas = saveCanvasRef.current;
    // @ts-ignore
    let context: CanvasRenderingContext2D = saveCanvasRef.current.getContext('2d');
    let saveImage = new Image();
    saveImage.onload = function(){
      // @ts-ignore
      context.clearRect( 0, 0, width, height)
      context.fillStyle = backgroundColor;
      context.fillRect(0,0, width, height);

      context.drawImage(saveImage, 0, 0);
      // @ts-ignore
      let canvasData = canvas.toDataURL("image/png");
      var a = document.createElement("a");
      a.download = "quads.png";
      a.href = canvasData;
      a.click();
    }
    saveImage.src = 'data:image/svg+xml;base64,'+ btoa(html);

  }
  return (
      <>
        {!errorVisible &&
        <div className="center">
          <div className="image-icon">
            <Upload setImage={setQuadImage} setError={setError}/>
            <img src={downloadIcon} className="download" alt="Save" height="50px" onClick={saveImage}/>
          </div>
          <Bulb onSwitch={() => setBulb(!bulb)}/>
          {/*todo: fix display on iPad Browser*/}

          <canvas height={height} width={width} ref={canvasRef} style={{display: "none"}}/>
          <canvas height={height} width={width} ref={saveCanvasRef} style={{display: "none"}}/>
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
