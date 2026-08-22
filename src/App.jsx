import { useEffect, useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import { LoadingState, MessageState } from "./components/ResultStates";
import WordResult from "./components/WordResult";
import WordSidebar from "./components/WordSidebar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getDictionaryEntry, getSuggestions, getWordConnections, getWriterTools, WordNotFoundError } from "./services/dictionaryApi";
import "./App.css";

const DEFAULT_WORD = "serendipity";
const EMPTY_CONNECTIONS = { synonyms: [], antonyms: [] };
const EMPTY_WRITER_TOOLS = { meter: null, exactRhymes: [] };

function getEntryConnections(entry) {
  const collect = (key) => [...new Set(entry.meanings.flatMap((meaning) => [
    ...(meaning[key] || []),
    ...meaning.definitions.flatMap((definition) => definition[key] || []),
  ]))].slice(0, 8);

  return { synonyms: collect("synonyms"), antonyms: collect("antonyms") };
}

function getInitialWord() {
  return new URLSearchParams(window.location.search).get("word")?.trim() || DEFAULT_WORD;
}

function App() {
  const [currentWord, setCurrentWord] = useState(getInitialWord);
  const [entry, setEntry] = useState(null);
  const [connections, setConnections] = useState(EMPTY_CONNECTIONS);
  const [writerTools, setWriterTools] = useState(EMPTY_WRITER_TOOLS);
  const [alternatives, setAlternatives] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [savedWords, setSavedWords] = useLocalStorage("wordwell-saved", []);
  const [history, setHistory] = useLocalStorage("wordwell-history", []);
  const requestRef = useRef(null);
  const noticeTimerRef = useRef(null);

  async function lookup(rawWord) {
    const word = rawWord.trim().toLowerCase();
    if (!word) {
      setStatus("error");
      setMessage("Type a word to begin your search.");
      return;
    }

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setCurrentWord(word);
    setStatus("loading");
    setMessage("");
    setAlternatives([]);
    setConnections(EMPTY_CONNECTIONS);
    setWriterTools(EMPTY_WRITER_TOOLS);
    setNotice("");

    try {
      const result = await getDictionaryEntry(word, { signal: controller.signal });
      if (controller.signal.aborted) return;

      setEntry(result);
      setStatus("success");
      setHistory((items) => [result.word, ...items.filter((item) => item !== result.word)].slice(0, 8));
      window.history.replaceState({}, "", `?word=${encodeURIComponent(result.word)}`);
      document.title = `${result.word} — Wordwell Dictionary`;

      const entryConnections = getEntryConnections(result);
      setConnections(entryConnections);
      getWordConnections(result.word, { signal: controller.signal })
        .then((words) => setConnections({
          synonyms: [...new Set([...entryConnections.synonyms, ...words.synonyms])].slice(0, 8),
          antonyms: [...new Set([...entryConnections.antonyms, ...words.antonyms])].slice(0, 8),
        }))
        .catch((error) => { if (error.name !== "AbortError") setConnections(entryConnections); });
      getWriterTools(result.word, { signal: controller.signal })
        .then(setWriterTools)
        .catch((error) => { if (error.name !== "AbortError") setWriterTools(EMPTY_WRITER_TOOLS); });
    } catch (error) {
      if (error.name === "AbortError") return;
      setEntry(null);

      if (error instanceof WordNotFoundError) {
        setStatus("not-found");
        setMessage(`We couldn't find “${word}”. Check the spelling or try one of these.`);
        getSuggestions(word, { max: 5 }).then(setAlternatives).catch(() => setAlternatives([]));
      } else {
        setStatus("error");
        setMessage("The dictionary is taking a moment. Your word list is safe—please try again.");
      }
    }
  }

  useEffect(() => {
    lookup(getInitialWord());
    return () => requestRef.current?.abort();
  }, []);

  function showNotice(text) {
    window.clearTimeout(noticeTimerRef.current);
    setNotice(text);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2400);
  }

  function toggleSavedWord() {
    if (!entry) return;
    const isSaved = savedWords.includes(entry.word);
    setSavedWords((items) => isSaved ? items.filter((word) => word !== entry.word) : [entry.word, ...items]);
    showNotice(isSaved ? "Removed from saved words" : "Saved to your word list");
  }

  async function shareWord() {
    const shareData = { title: `${entry.word} — Wordwell`, text: `Explore the meaning of ${entry.word} on Wordwell.`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showNotice("Link copied to your clipboard");
      }
    } catch (error) {
      if (error.name !== "AbortError") showNotice("Sharing isn't available right now");
    }
  }

  const isSaved = entry ? savedWords.includes(entry.word) : false;

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Wordwell home">
          <span className="brand-mark" aria-hidden="true"><img src="/wordwell-mark.svg" alt="" /></span>
          <span>Wordwell</span>
        </a>
        <p className="header-note">A place for curious minds.</p>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">Your everyday word companion</p>
          <h1 id="hero-title">Find the exact word<br />you're looking for.</h1>
          <SearchBar initialValue={currentWord} isLoading={status === "loading"} onSearch={lookup} />
        </section>

        <section className="result-region" aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" && <LoadingState />}
          {(status === "error" || status === "not-found") && (
            <MessageState type={status} message={message} suggestions={alternatives} onRetry={() => lookup(currentWord)} onSearch={lookup} />
          )}
          {status === "success" && entry && (
            <div className="workspace-grid">
              <WordResult entry={entry} isSaved={isSaved} notice={notice} onSave={toggleSavedWord} onSearch={lookup} onShare={shareWord} />
              <WordSidebar connections={connections} history={history} savedWords={savedWords} writerTools={writerTools} onClearHistory={() => setHistory([])} onSearch={lookup} />
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a className="brand brand--footer" href="/" aria-label="Wordwell home"><span className="brand-mark" aria-hidden="true"><img src="/wordwell-mark.svg" alt="" /></span><span>Wordwell</span></a>
          <p>Designed and built by Tiffany Mackay as a responsive product-design case study.</p>
        </div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/tiffanylmackay/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/tiffanymackay/dictionary-app-project" target="_blank" rel="noreferrer">GitHub source</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
