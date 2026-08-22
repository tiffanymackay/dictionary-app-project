import { Bookmark, Check, ExternalLink, Share2, Volume2 } from "lucide-react";

function uniqueWords(words = []) {
  return [...new Set(words.filter(Boolean))].slice(0, 10);
}

export default function WordResult({ entry, isSaved, notice, onSave, onSearch, onShare }) {
  const audio = entry.phonetics?.find((item) => item.audio)?.audio;
  const phonetic = entry.phonetic || entry.phonetics?.find((item) => item.text)?.text;

  function playAudio() {
    const player = document.getElementById("word-pronunciation");
    player?.play();
  }

  return (
    <article className="definition-card">
      <header className="word-header">
        <div>
          <p className="eyebrow">Dictionary entry</p>
          <h2>{entry.word}</h2>
          {phonetic && <p className="phonetic">{phonetic}</p>}
        </div>
        <div className="word-actions">
          {audio && (
            <button className="round-action" type="button" onClick={playAudio} aria-label={`Listen to ${entry.word}`}>
              <Volume2 aria-hidden="true" size={20} /><span>Listen</span>
            </button>
          )}
          <button className={`round-action ${isSaved ? "is-saved" : ""}`} type="button" onClick={onSave} aria-pressed={isSaved}>
            {isSaved ? <Check aria-hidden="true" size={20} /> : <Bookmark aria-hidden="true" size={20} />}
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
          <button className="icon-action" type="button" onClick={onShare} aria-label={`Share ${entry.word}`}>
            <Share2 aria-hidden="true" size={20} />
          </button>
          {audio && <audio id="word-pronunciation" src={audio} preload="none" />}
        </div>
        {notice && <div className="action-notice" role="status">{notice}</div>}
      </header>

      <div className="meanings">
        {entry.meanings?.map((meaning, meaningIndex) => {
          const synonyms = uniqueWords([
            ...meaning.synonyms,
            ...meaning.definitions.flatMap((definition) => definition.synonyms || []),
          ]);
          const antonyms = uniqueWords([
            ...meaning.antonyms,
            ...meaning.definitions.flatMap((definition) => definition.antonyms || []),
          ]);

          return (
            <section className="meaning" key={`${meaning.partOfSpeech}-${meaningIndex}`}>
              <div className="part-of-speech"><span>{meaning.partOfSpeech}</span></div>
              <ol>
                {meaning.definitions.slice(0, 5).map((definition, index) => (
                  <li key={`${definition.definition}-${index}`}>
                    <p>{definition.definition}</p>
                    {definition.example && <blockquote>“{definition.example}”</blockquote>}
                  </li>
                ))}
              </ol>
              {synonyms.length > 0 && (
                <div className="word-relation"><h3>Synonyms</h3><div className="chip-list">{synonyms.map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}</div></div>
              )}
              {antonyms.length > 0 && (
                <div className="word-relation"><h3>Antonyms</h3><div className="chip-list">{antonyms.map((word) => <button type="button" key={word} onClick={() => onSearch(word)}>{word}</button>)}</div></div>
              )}
            </section>
          );
        })}

        {entry.sourceUrls?.[0] && (
          <footer className="entry-source">
            <span>Definition source</span>
            <a href={entry.sourceUrls[0]} target="_blank" rel="noreferrer">Wiktionary <ExternalLink aria-hidden="true" size={14} /></a>
          </footer>
        )}
      </div>
    </article>
  );
}
