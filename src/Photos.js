import React from "react";
import "./Photos.css";

export default function Photos(props) {
    if (props.photos) {
        console.log(props.photos);
      return (
        <div className="container-box container">
            <div className="row">
                {props.photos.map(function(photo, index) {
                    return (
                        <div className="col-4 photos" key={index}>
                            <a href={photo.src.original} target="_blank" rel="noreferrer">
                            <img src={photo.src.landscape} alt="Search term photograph" className="img-fluid" />
                            </a>
                        </div>
                    );
                })}

            </div>

        </div>
    );  
    } else {
        return null;
    }
    
}