import React, {useRef} from 'react';
import downloadIcon from '../assets/svg/download.svg';

import * as d3 from "d3";
import '../style/save.scss';

interface SaveProps {
    size: number
}

export default function Save({size}: SaveProps) {
    const saveCanvasRef = useRef<HTMLCanvasElement>(null);

    function saveImage(saveCanvasRef: any, saveSize: number) {
        let svg = d3.select("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")

        if (!svg) return;
        // @ts-ignore
        let html = svg.node().parentNode.innerHTML;

        let canvas = saveCanvasRef.current;
        let context: CanvasRenderingContext2D = saveCanvasRef.current.getContext('2d');
        let saveImage = new Image();
        saveImage.onload = function(){
            // @ts-ignore
            context.clearRect( 0, 0, saveSize, saveSize)
            // context.fillStyle = backgroundColor;
            context.fillRect(0,0, saveSize, saveSize);

            context.drawImage(saveImage, 0, 0, saveSize, saveSize);
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
        <div className="save-container">
            <canvas height={size} width={size} ref={saveCanvasRef} style={{display: "none"}}/>
            <img src={downloadIcon} alt="Save" height="50px" onClick={() => saveImage(saveCanvasRef, size)}/>
        </div>
    )
}
