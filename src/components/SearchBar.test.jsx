import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import SearchBar from "./SearchBar";
import { getSuggestions } from "../services/dictionaryApi";

vi.mock("../services/dictionaryApi", () => ({ getSuggestions: vi.fn() }));

beforeEach(() => getSuggestions.mockResolvedValue(["luminous", "luminary"]));

test("offers keyboard-accessible word suggestions", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<SearchBar initialValue="" isLoading={false} onSearch={onSearch} />);

  const input = screen.getByRole("combobox", { name: /search the dictionary/i });
  await user.type(input, "lumi");
  const option = await screen.findByRole("option", { name: /luminous/i });
  await user.click(option);

  expect(onSearch).toHaveBeenCalledWith("luminous");
});

test("submits the typed word", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<SearchBar initialValue="resilient" isLoading={false} onSearch={onSearch} />);

  await user.click(screen.getByRole("button", { name: /look up/i }));
  expect(onSearch).toHaveBeenCalledWith("resilient");
});
