import React from "react";
import "./Dictionary.css";

export default function Dictionary() {
    function search(event) {
        event.preventDefault();
        alert("searching...");
    }

    return (
    <div className="Dictionary container-box">  
    <h1>Word lookup</h1>        
        <form onSubmit={search}>
            <div class="d-flex">
                <div className="flex-grow-1">
                    <input type="search" placeholder="Search" autoFocus={true} className="form-control" /> 
                </div>
                <div className="mx-1">
                    <button value="Search" className="btn btn-secondary mx-1 px-3" type="submit">Search</button>
                </div>
            </div>
        </form>
  
    </div>
        );
}