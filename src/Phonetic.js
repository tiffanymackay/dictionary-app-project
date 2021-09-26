import React from "react";
import "./Phonetic.css";

export default function Phonetic(props) {

    if (props.phonetic.audio) {
        return (
            <div className="phonetic">
                <audio className="phonetic container" controls src={props.phonetic.audio} />
            </div>
                );
    } else {
        return null;
    }
}