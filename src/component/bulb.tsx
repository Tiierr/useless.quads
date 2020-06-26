import React, {useEffect, useState} from 'react';
import './bulb.scss';

interface BulbProps {
    onSwitch: () => void
}

export default function Bulb({onSwitch}: BulbProps) {
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
    const [bulbSwitch, setSwitch] = useState(false);

    useEffect(() => {
        const lightStyle = light();
        if (!bulbSwitch){
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
    }, [bulbSwitch])

    return (
        <div className="bulb-container">
            <div className="light">
                <div className="cable" style={cableStyle}/>
                <div className="bulb-cover" style={coverStyle}/>
                <div className="bulb" style={bulbStyle} onClick={() => {setSwitch(!bulbSwitch); onSwitch()}}>
                    <div className="bulb-light" style={bulbLightStyle}/>
                </div>
            </div>
        </div>
    )
}
