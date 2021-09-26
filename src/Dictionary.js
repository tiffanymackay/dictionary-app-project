import React, { useState } from "react";
import axios from "axios";
import Results from "./Results";
import "./Dictionary.css";

export default function Dictionary() {
    let [keyword, setKeyword] = useState("");
    let [results, setResults] = useState(null);
    let [loaded, setLoaded] = useState(false);

    function handleResponse(response) {
        setResults(response.data[0]);
    }
    
    function search() {
        let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
        axios.get(apiUrl).then(handleResponse);
    }

    function handleSubmit(event) {
        event.preventDefault();
        search();
    }
    function handleKeywordChange(event) {
        setKeyword(event.target.value);
    }

    function load() {
        setLoaded(true);
        search();
    }

    if (loaded) {
        return (
        <div className="Dictionary">  
            <div className="container-box">
                <h1>Word lookup</h1>        
                <form onSubmit={handleSubmit}>
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <input onChange={handleKeywordChange} type="search" placeholder="Search" autoFocus={true} className="form-control" /> 
                        </div>
                        <div className="mx-1">
                            <button value="Search" className="btn mx-1 px-3" type="submit">Search</button>
                        </div>
                    </div>
                </form>
                <div className="suggestions">Such as: moon, sunset, nature </div>
            </div>
            <Results results={results} />
        </div>
        );
    } else {
        load();
        return ("Loading...");
    }
}