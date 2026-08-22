import { expect, test } from "vitest";
import { toStressPattern } from "./dictionaryApi";

test("converts ARPAbet stress markers into a readable meter pattern", () => {
  expect(toStressPattern("S ER0 EH1 N D IH0 P AH0 T IY0")).toBe("◡ — ◡ ◡ ◡");
});

test("ignores consonants when building a meter pattern", () => {
  expect(toStressPattern("K AE1 T")).toBe("—");
});
