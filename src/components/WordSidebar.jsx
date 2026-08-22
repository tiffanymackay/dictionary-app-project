import { Bookmark, Clock3, Compass, Trash2 } from "lucide-react";
import WriterTools from "./WriterTools";

function WordList({ emptyText, items, onClear, onSearch }) {
  if (items.length === 0) return <p className="empty-list">{emptyText}</p>;
  return (
    <>
      <div className="sidebar-word-list">
        {items.map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}
      </div>
      {onClear && (
        <button className="clear-list" type="button" onClick={onClear}><Trash2 aria-hidden="true" size={14} /> Clear history</button>
      )}
    </>
  );
}

export default function WordSidebar({ connections, history, savedWords, writerTools, onClearHistory, onSearch }) {
  return (
    <aside className="word-sidebar" aria-label="Your word workspace">
      <WriterTools tools={writerTools} onSearch={onSearch} />
      <section className="sidebar-card">
        <div className="sidebar-heading"><Compass aria-hidden="true" size={18} /><h2>Explore further</h2></div>
        {connections.synonyms.length > 0 || connections.antonyms.length > 0 ? (
          <div className="connection-groups">
            {connections.synonyms.length > 0 && <div><h3>Similar words</h3><div className="chip-list chip-list--sidebar">{connections.synonyms.map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}</div></div>}
            {connections.antonyms.length > 0 && <div><h3>Opposites</h3><div className="chip-list chip-list--sidebar">{connections.antonyms.map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}</div></div>}
          </div>
        ) : <p className="empty-list">No related words found for this entry.</p>}
      </section>

      <section className="sidebar-card">
        <div className="sidebar-heading"><Bookmark aria-hidden="true" size={18} /><h2>Saved words</h2><span>{savedWords.length}</span></div>
        <WordList items={savedWords} emptyText="Save a word and it will stay here on this device." onSearch={onSearch} />
      </section>

      <section className="sidebar-card">
        <div className="sidebar-heading"><Clock3 aria-hidden="true" size={18} /><h2>Recent searches</h2></div>
        <WordList items={history} emptyText="Your recent lookups will appear here." onSearch={onSearch} onClear={history.length ? onClearHistory : undefined} />
      </section>
    </aside>
  );
}
