import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { getSuggestions } from "../services/dictionaryApi";

const EXAMPLE_WORDS = ["serendipity", "luminous", "resilient"];

export default function SearchBar({ initialValue, isLoading, onSearch }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const inputRef = useRef(null);

  useEffect(() => setQuery(initialValue), [initialValue]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const words = await getSuggestions(query, { signal: controller.signal });
        setSuggestions(words.filter((word) => word.toLowerCase() !== query.trim().toLowerCase()));
        setActiveIndex(-1);
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function submit(word = query) {
    const nextWord = word.trim();
    if (!nextWord) return;
    setQuery(nextWord);
    setIsOpen(false);
    onSearch(nextWord);
  }

  function handleKeyDown(event) {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    }
    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      submit(suggestions[activeIndex]);
    }
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="search-area">
      <form className="search-form" role="search" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <label className="sr-only" htmlFor="dictionary-search">Search the dictionary</label>
        <Search aria-hidden="true" size={21} />
        <input
          ref={inputRef}
          id="dictionary-search"
          role="combobox"
          type="search"
          value={query}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen && suggestions.length > 0}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          onChange={(event) => { setQuery(event.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder="Search for any English word"
          autoComplete="off"
        />
        {query && (
          <button className="clear-search" type="button" aria-label="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <X aria-hidden="true" size={18} />
          </button>
        )}
        <button className="submit-search" type="submit" disabled={isLoading}>
          <span>{isLoading ? "Searching" : "Look up"}</span>
          <ArrowRight aria-hidden="true" size={19} />
        </button>

        {isOpen && suggestions.length > 0 && (
          <div className="suggestion-list" id={listId} role="listbox" aria-label="Word suggestions">
            {suggestions.map((word, index) => (
              <button
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "is-active" : ""}
                key={word}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submit(word)}
              >
                <Search aria-hidden="true" size={16} /><span>{word}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="example-words" aria-label="Example searches">
        <span>Try</span>
        {EXAMPLE_WORDS.map((word) => <button type="button" key={word} onClick={() => submit(word)}>{word}</button>)}
      </div>
    </div>
  );
}
