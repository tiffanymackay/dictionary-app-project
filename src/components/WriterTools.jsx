import { Feather } from "lucide-react";

function syllableLabel(count) {
  if (!count) return "Syllables unavailable";
  return `${count} ${count === 1 ? "syllable" : "syllables"}`;
}

export default function WriterTools({ tools, onSearch }) {
  const { meter, exactRhymes } = tools;

  return (
    <section className="sidebar-card writer-tools">
      <div className="sidebar-heading"><Feather aria-hidden="true" size={18} /><h2>Writer's toolkit</h2></div>

      {meter && (
        <div className="meter-summary">
          <div><span>Word meter</span><strong>{syllableLabel(meter.syllables)}</strong></div>
          {meter.stressPattern && (
            <div className="stress-pattern" aria-label={`Stress pattern ${meter.stressPattern}`}>
              <span>{meter.stressPattern}</span>
              <small>— stressed&nbsp;&nbsp; ◡ unstressed</small>
            </div>
          )}
        </div>
      )}

      <div className="rhyme-heading">
        <h3>Exact rhymes</h3>
        <span>{exactRhymes.length}</span>
      </div>

      {exactRhymes.length > 0 ? (
        <div className="rhyme-list">
          {exactRhymes.slice(0, 12).map((rhyme) => (
            <button type="button" key={rhyme.word} onClick={() => onSearch(rhyme.word)}>
              <strong>{rhyme.word}</strong>
              <span>{rhyme.syllables ?? "?"} syl.</span>
              {rhyme.stressPattern && <small aria-label={`Stress pattern ${rhyme.stressPattern}`}>{rhyme.stressPattern}</small>}
            </button>
          ))}
        </div>
      ) : <p className="empty-list">No exact rhymes were found for this word.</p>}

      <p className="writer-note">Meter shows estimated syllables and word stress. Use it as a guide when shaping a line.</p>
    </section>
  );
}
