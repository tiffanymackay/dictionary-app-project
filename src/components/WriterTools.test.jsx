import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import WriterTools from "./WriterTools";

const tools = {
  meter: { word: "cat", syllables: 1, stressPattern: "—" },
  exactRhymes: [
    { word: "hat", syllables: 1, stressPattern: "—" },
    { word: "caveat", syllables: 3, stressPattern: "— ◡ ◡" },
  ],
};

test("shows exact rhymes with syllable and stress information", () => {
  render(<WriterTools tools={tools} onSearch={vi.fn()} />);
  expect(screen.getByText("1 syllable")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /caveat 3 syl/i })).toBeInTheDocument();
});

test("lets writers look up a rhyme", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<WriterTools tools={tools} onSearch={onSearch} />);
  await user.click(screen.getByRole("button", { name: /hat 1 syl/i }));
  expect(onSearch).toHaveBeenCalledWith("hat");
});
