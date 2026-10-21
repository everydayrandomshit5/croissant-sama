import { describe, expect, test } from "vitest";
import { parseUci } from "chessops";
import { generateAnimeMoveCommentary } from "@/components/chesssama/animeDialogue";
import { defaultTree, createNode } from "@/utils/treeReducer";
import { getPGN } from "@/utils/chess";

describe("Anime Dialogue Commentary", () => {
  test("generates blunder dialogue with best move recommendation", () => {
    const result = generateAnimeMoveCommentary({
      san: "O-O",
      annotation: "??",
      color: "black",
      bestSan: "Be7",
    });

    expect(result.category).toBe("blunder");
    expect(result.categoryLabel).toBe("Blunder ??");
    expect(result.dialogue).toContain("Be7");
    expect(result.formattedMarkdown).toContain(result.speaker);
    expect(result.formattedMarkdown).toContain("**");
    expect(result.formattedMarkdown).toContain("*");
  });

  test("generates brilliant dialogue for piece sacrifice", () => {
    const result = generateAnimeMoveCommentary({
      san: "Bxf7+",
      annotation: "!!",
      color: "white",
      isSacrifice: true,
    });

    expect(result.category).toBe("brilliant");
    expect(result.categoryLabel).toBe("Brilliant !!");
    expect(result.formattedMarkdown).toContain("Master");
  });

  test("embeds commentary into PGN string format", () => {
    const tree = defaultTree();
    const moveNode = createNode({
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
      san: "e4",
      move: parseUci("e2e4")!,
      halfMoves: 1,
    });
    
    const commentary = generateAnimeMoveCommentary({
      san: "e4",
      annotation: "!",
      color: "white",
    });

    moveNode.comment = commentary.formattedMarkdown;
    moveNode.annotations = ["!"];
    tree.root.children.push(moveNode);

    const pgn = getPGN(tree.root, {
      headers: null,
      glyphs: true,
      comments: true,
      variations: false,
      extraMarkups: false,
    });

    expect(pgn).toContain("1. e4!");
    expect(pgn).toContain(`{${commentary.formattedMarkdown}}`);
  });
});
