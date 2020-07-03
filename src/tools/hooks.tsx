import {useEffect, useState} from 'react';
import Quad from "./quad";

function useInterval() {
    const [svg, setSvg]  = useState<any>(null);
    const [leafs, setLeafs]  = useState<any>(null);
    const [delay, setDelay]  = useState<any>(1024);

    // Set up the interval.
    useEffect(() => {
        if (leafs?.length === 0) {
            return
        }
        function tick() {
            if (leafs[0].w !== delay){
                setDelay(leafs[0].w);
            }
            if (!leafs) return;

            let q = leafs.shift();
            if (q === undefined) {
                return;
            } else {
                q.splitToCircle(svg);
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, leafs, svg]);


    function startInterval(svg: any, leafs: Quad[]){
        setLeafs(leafs);
        setSvg(svg);
    }
    return startInterval;
}

export default useInterval;
