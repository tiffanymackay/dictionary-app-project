import React from "react";
import "./Meaning.css";

export default function Meaning(props) {
    console.log(props.meaning);
    return (<div className="Meaning">
        <h3>{props.meaning.partOfSpeech}</h3>
        {props.meaning.definitions.map(function (definition, index) {
            return (
                <div key={index}>
                    <p>{definition.definition}</p>
                    <p className="examples">{definition.example}</p>
                </div>
            );
        })}        
    </div>);
}