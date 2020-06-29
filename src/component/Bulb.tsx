import React, {useEffect, useState} from 'react';
import '../style/bulb.scss';
import {useLocalStorage} from "@rehooks/local-storage";

export default function Bulb() {
    const lightColor = "#fffffb", darkColor = "#222";

    const [backgroundColor, setBGColor] = useLocalStorage<string>("backgroundColor", lightColor);
    const [bulb, setBulb] = useLocalStorage<boolean>("bulb", false);

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;
    }, [backgroundColor])


    useEffect(() => {
        setBGColor(bulb ? darkColor : lightColor)
    }, [bulb, setBGColor])


    const light = () => {
        return {
            bulbLight: {
                backgroundColor: "#CCCC00",
                boxShadow: "0 6px 20px 2px #CCCC00",
                border: "1.5px solid rgba(255, 255, 255, 0.2)"
            },
            bulb: {
                border: "1px rgba(255, 255, 255, 0.2)",
                boxShadow: "inset 0 0 2px 2px rgba(255, 255, 255, 0.2)"
            },
            bulbCover: {
                background: "rgba(250, 250, 250, 0.1)"
            },
            cable: {
                background: "rgba(250, 250, 250, 0.4)"
            },
        }
    }

    const [cableStyle, setCableStyle] = useState({});
    const [coverStyle, setCoverStyle] = useState({});
    const [bulbStyle, setBulbStyle] = useState({});
    const [bulbLightStyle, setLightStyle] = useState({});

    useEffect(() => {
        const lightStyle = light();
        if (!bulb){
            setLightStyle({})
            setBulbStyle({})
            setCoverStyle({})
            setCableStyle({})
        } else {
            setLightStyle(lightStyle.bulbLight)
            setBulbStyle(lightStyle.bulb)
            setCoverStyle(lightStyle.bulbCover)
            setCableStyle(lightStyle.cable)
        }
    }, [bulb,  setCableStyle, setLightStyle, setCoverStyle, setBulbStyle])

    return (
        <div className="bulb-container">
            <div className="light">
                <div className="cable" style={cableStyle}/>
                <div className="bulb-cover" style={coverStyle}/>
                <div className="bulb" style={bulbStyle} onClick={() => setBulb(!bulb)}>
                    <div className="bulb-light" style={bulbLightStyle}/>
                </div>
            </div>
        </div>
    )
}
