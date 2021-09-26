import React from "react";
import "./Phonetic.css";

export default function Phonetic(props) {
    return (
    <div className="phonetic">
       <span className="phonetic-text"> {props.phonetic.text}</span>
        <br />
        <audio className="container" controls src={props.phonetic.audio} />
        <br />
    </div>
    );
}