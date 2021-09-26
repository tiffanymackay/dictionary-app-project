import React, { useState } from "react";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import "./Dictionary.css";

export default function Dictionary(props) {
    let [keyword, setKeyword] = useState(props.defaultKeyword);
    let [results, setResults] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [photos, setPhotos] = useState(null);

    function handleDictionaryResponse(response) {
        setResults(response.data[0]);
    }
    function handlePexelsResponse(response) {
        setPhotos(response.data.photos);
    }
    
    function search() {
        let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
        axios.get(apiUrl).then(handleDictionaryResponse);

        let pexelsApiKey = "563492ad6f9170000100000177fb551114114a9baff3e189b196bec8";
        let pexelsApiUrl = `https://api.pexels.com/v1/search?query=${keyword}&per_page=9`;
        let headers = { Authorization: `Bearer ${pexelsApiKey}` }
        axios.get(pexelsApiUrl, { headers: headers }).then(handlePexelsResponse);
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
            <Photos photos={photos} />
        </div>
        );
    } else {
        load();
        return ("Loading...");
    }
}