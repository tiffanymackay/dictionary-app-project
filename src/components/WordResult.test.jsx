import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import WordResult from "./WordResult";

const entry = {
  word: "luminous",
  phonetic: "/ˈluːmɪnəs/",
  phonetics: [],
  meanings: [{
    partOfSpeech: "adjective",
    synonyms: ["bright"],
    antonyms: ["dark"],
    definitions: [{ definition: "Emitting or reflecting light.", example: "A luminous moon." }],
  }],
  sourceUrls: ["https://en.wiktionary.org/wiki/luminous"],
};

test("renders a structured entry and makes related words searchable", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<WordResult entry={entry} isSaved={false} notice="" onSave={vi.fn()} onSearch={onSearch} onShare={vi.fn()} />);

  expect(screen.getByRole("heading", { name: "luminous" })).toBeInTheDocument();
  expect(screen.getByText("Emitting or reflecting light.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "bright" }));
  expect(onSearch).toHaveBeenCalledWith("bright");
});

test("exposes save state accessibly", () => {
  render(<WordResult entry={entry} isSaved notice="" onSave={vi.fn()} onSearch={vi.fn()} onShare={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
});
