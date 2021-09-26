import React from "react";
import Synonyms from "./Synonyms"
import "./Meaning.css";

export default function Meaning(props) {
    return (<div className="Meaning container-box">
        <h3>{props.meaning.partOfSpeech}</h3>
        {props.meaning.definitions.map(function (definition, index) {
            return (
                <div key={index}>
                    <p className="definition">{definition.definition}</p>
                    <p className="examples">"{definition.example}"</p>
                    <Synonyms synonyms={definition.synonyms}/>
                </div>
            );
        })}        
    </div>);
}