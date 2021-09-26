import React from "react";
import Phonetic from "./Phonetic";
import Meaning from "./Meaning";

export default function Results(props) {
    console.log(props.results);

    if (props.results) {
          return (
    <div>
        <div className="container-box results">
            <h2>
                {props.results.word}
            </h2>

                {props.results.phonetics.map(function(phonetic, index) {
                    return (
                        <div key={index}>
                            <Phonetic phonetic={phonetic} />
                        </div>
                    );
                })}
        </div>
        {props.results.meanings.map(function(meaning, index) {
            return (
                <div key={index}>
                    <Meaning meaning={meaning} />
                </div>
            );
        })}
    </div>
    );
    } else {
        return null;
    }
  
}