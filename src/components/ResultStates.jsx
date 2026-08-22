import { AlertCircle, RotateCcw, SearchX } from "lucide-react";

export function LoadingState() {
  return (
    <div className="definition-card skeleton-card" aria-label="Loading definition">
      <div className="skeleton-header"><span /><span /><span /></div>
      <div className="skeleton-body"><span /><span /><span /><span /></div>
    </div>
  );
}

export function MessageState({ type, message, suggestions = [], onRetry, onSearch }) {
  const notFound = type === "not-found";
  return (
    <div className="state-card state-card--message">
      <span className="state-icon" aria-hidden="true">{notFound ? <SearchX size={24} /> : <AlertCircle size={24} />}</span>
      <p className="eyebrow">{notFound ? "No exact match" : "Something went wrong"}</p>
      <h2>{message}</h2>
      {suggestions.length > 0 && (
        <div className="alternative-words"><p>Did you mean</p><div className="chip-list">{suggestions.slice(0, 5).map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}</div></div>
      )}
      {!notFound && <button className="retry-button" type="button" onClick={onRetry}><RotateCcw aria-hidden="true" size={16} /> Try again</button>}
    </div>
  );
}
