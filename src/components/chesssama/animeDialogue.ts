import type { Color, Role } from "chessops";
import { ANNOTATION_INFO, type Annotation } from "@/utils/annotation";
import {
  type DialogueCategory,
  type AnimeDialogueResult,
  type CharacterDialogueMap,
} from "./dialogues/dialogueTypes";
import {
  SERAPHINE_WHITE_DIALOGUES,
  AURELIAN_WHITE_DIALOGUES,
  LUMINA_WHITE_DIALOGUES,
  FREYA_WHITE_DIALOGUES,
  ELEANOR_WHITE_DIALOGUES,
  DAWN_SQUIRE_DIALOGUES,
} from "./dialogues/whiteDialogues";
import {
  LILITH_BLACK_DIALOGUES,
  MALAKOR_BLACK_DIALOGUES,
  VESPERA_BLACK_DIALOGUES,
  MORWENNA_BLACK_DIALOGUES,
  CARMILLA_BLACK_DIALOGUES,
  DUSK_SQUIRE_DIALOGUES,
} from "./dialogues/blackDialogues";

export type { DialogueCategory, AnimeDialogueResult };

const DIALOGUE_REGISTRY: Record<string, CharacterDialogueMap> = {
  white_queen: SERAPHINE_WHITE_DIALOGUES,
  white_king: AURELIAN_WHITE_DIALOGUES,
  white_bishop: LUMINA_WHITE_DIALOGUES,
  white_knight: FREYA_WHITE_DIALOGUES,
  white_rook: ELEANOR_WHITE_DIALOGUES,
  white_pawn: DAWN_SQUIRE_DIALOGUES,

  black_queen: LILITH_BLACK_DIALOGUES,
  black_king: MALAKOR_BLACK_DIALOGUES,
  black_bishop: VESPERA_BLACK_DIALOGUES,
  black_knight: MORWENNA_BLACK_DIALOGUES,
  black_rook: CARMILLA_BLACK_DIALOGUES,
  black_pawn: DUSK_SQUIRE_DIALOGUES,
};

interface CharacterMeta {
  speaker: string;
  speakerTitle: string;
  avatarChar: string;
  themeColor: string;
}

const CHARACTER_METAS: Record<string, CharacterMeta> = {
  white_queen: {
    speaker: "Seraphine",
    speakerTitle: "Sovereign of the Rose Dawn",
    avatarChar: "♕",
    themeColor: "#F4A6C6",
  },
  white_king: {
    speaker: "Aurelian",
    speakerTitle: "The Silver Sovereign",
    avatarChar: "♔",
    themeColor: "#E2E8F0",
  },
  white_bishop: {
    speaker: "Lady Lumina",
    speakerTitle: "High Shrine Priestess of the Lotus Dawn",
    avatarChar: "♗",
    themeColor: "#F9A8D4",
  },
  white_knight: {
    speaker: "Dame Freya",
    speakerTitle: "The Sunlit Valkyrie",
    avatarChar: "♘",
    themeColor: "#FDE047",
  },
  white_rook: {
    speaker: "Lady Eleanor",
    speakerTitle: "The Aegis Sentinel",
    avatarChar: "♖",
    themeColor: "#CBD5E1",
  },
  white_pawn: {
    speaker: "Dawn Squire",
    speakerTitle: "The Devoted Vanguard",
    avatarChar: "♙",
    themeColor: "#FBCFE8",
  },

  black_queen: {
    speaker: "Lilith",
    speakerTitle: "The Abyssal Sovereign",
    avatarChar: "♛",
    themeColor: "#A855F7",
  },
  black_king: {
    speaker: "Malakor",
    speakerTitle: "The Obsidian Sovereign",
    avatarChar: "♚",
    themeColor: "#F59E0B",
  },
  black_bishop: {
    speaker: "Vespera",
    speakerTitle: "The Shadow Inquisitor",
    avatarChar: "♝",
    themeColor: "#C084FC",
  },
  black_knight: {
    speaker: "Morwenna",
    speakerTitle: "The Eclipse Duelist",
    avatarChar: "♞",
    themeColor: "#EAB308",
  },
  black_rook: {
    speaker: "Carmilla",
    speakerTitle: "The Dread Bastion",
    avatarChar: "♜",
    themeColor: "#EF4444",
  },
  black_pawn: {
    speaker: "Dusk Squire",
    speakerTitle: "The Bratty Vanguard",
    avatarChar: "♟",
    themeColor: "#D8B4FE",
  },
};

function getRoleFromSan(san: string): Role {
  if (!san) return "pawn";
  if (san.startsWith("N")) return "knight";
  if (san.startsWith("B")) return "bishop";
  if (san.startsWith("R")) return "rook";
  if (san.startsWith("Q")) return "queen";
  if (san.startsWith("K") || san === "O-O" || san === "O-O-O") return "king";
  return "pawn";
}

function getCategoryFromAnnotation(
  annotation: Annotation | undefined,
  san: string,
  isSacrifice?: boolean,
): DialogueCategory {
  if (san.includes("#")) return "checkmate";
  if (annotation === "!!") return "brilliant";
  if (annotation === "??") return "blunder";
  if (annotation === "?") return "mistake";
  if (annotation === "?!") return "dubious";
  if (isSacrifice) return "brilliant";
  if (san.includes("=")) return "promotion";
  if (annotation === "!?") return "interesting";
  if (annotation === "!") return "good";
  if (annotation === "N") return "novelty";
  if (san.includes("x")) return "capture";
  if (san.includes("+")) return "check";
  return "normal";
}

export function generateAnimeMoveCommentary({
  san,
  annotation,
  color,
  bestSan,
  isSacrifice,
  novelty,
  preferredCharacterId,
}: {
  san: string;
  annotation?: Annotation;
  color: Color;
  bestSan?: string;
  isSacrifice?: boolean;
  novelty?: boolean;
  preferredCharacterId?: string;
}): AnimeDialogueResult {
  const role = getRoleFromSan(san);
  let category = getCategoryFromAnnotation(annotation, san, isSacrifice);
  if (novelty && category === "normal") {
    category = "novelty";
  }

  // Determine character ID
  let characterId = color === "white" ? "white_queen" : "black_queen";

  if (preferredCharacterId && preferredCharacterId !== "auto") {
    characterId = preferredCharacterId;
  } else {
    // "auto" mode: Queen or King speaks for dramatic climaxes, or moving piece speaks
    if (category === "blunder" || category === "brilliant" || category === "checkmate") {
      characterId = color === "white" ? "white_queen" : "black_queen";
    } else {
      switch (role) {
        case "king":
          characterId = color === "white" ? "white_king" : "black_king";
          break;
        case "queen":
          characterId = color === "white" ? "white_queen" : "black_queen";
          break;
        case "bishop":
          characterId = color === "white" ? "white_bishop" : "black_bishop";
          break;
        case "knight":
          characterId = color === "white" ? "white_knight" : "black_knight";
          break;
        case "rook":
          characterId = color === "white" ? "white_rook" : "black_rook";
          break;
        case "pawn":
        default:
          characterId = color === "white" ? "white_pawn" : "black_pawn";
          break;
      }
    }
  }

  const meta = CHARACTER_METAS[characterId] || CHARACTER_METAS["white_queen"];
  const dialogueMap = DIALOGUE_REGISTRY[characterId] || SERAPHINE_WHITE_DIALOGUES;
  const pool = dialogueMap[category] || dialogueMap.normal || SERAPHINE_WHITE_DIALOGUES.normal;

  // Pick deterministic line
  const hash = Math.abs(
    (san || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
      (bestSan || "").length,
  );
  const selectedTemplate = pool[hash % pool.length];

  let dialogueText = selectedTemplate.text;
  let bestSanHint: string | undefined;

  if (bestSan && (category === "blunder" || category === "mistake" || category === "dubious")) {
    if (category === "blunder") {
      bestSanHint = `(Best: ${bestSan})`;
      dialogueText += ` ${meta.speaker} whispers: "${bestSan} was the winning square... please don't leave me so bare next time! ♡"`;
    } else if (category === "mistake") {
      bestSanHint = `(Best: ${bestSan})`;
      dialogueText += ` ${meta.speaker}: "You should have slipped into ${bestSan} instead... you almost had it!"`;
    } else {
      bestSanHint = `(Recommended: ${bestSan})`;
      dialogueText += ` ${meta.speaker}: "${bestSan} was much safer, but I appreciate your wild spirit! ♡"`;
    }
  }

  const categoryLabel =
    category === "blunder"
      ? "Blunder ??"
      : category === "mistake"
        ? "Mistake ?"
        : category === "dubious"
          ? "Dubious ?!"
          : category === "brilliant"
            ? "Brilliant !!"
            : category === "good"
              ? "Good !"
              : category === "interesting"
                ? "Interesting !?"
                : category === "novelty"
                  ? "Novelty N"
                  : category === "capture"
                    ? "Capture ⚔"
                    : category === "promotion"
                      ? "Promotion ♕"
                      : category === "checkmate"
                        ? "Checkmate #"
                        : category === "check"
                          ? "Check +"
                          : "Analysis";

  const categoryColor =
    category === "blunder"
      ? "red"
      : category === "mistake"
        ? "orange"
        : category === "dubious"
          ? "yellow"
          : category === "brilliant"
            ? "cyan"
            : category === "good"
              ? "teal"
              : category === "interesting"
                ? "lime"
                : category === "novelty"
                  ? "violet"
                  : category === "capture"
                    ? "grape"
                    : category === "promotion"
                      ? "yellow"
                      : "pink";

  const formattedMarkdown = `**${meta.speaker}:** *"${dialogueText}"*`;

  return {
    speaker: meta.speaker,
    speakerTitle: meta.speakerTitle,
    characterId,
    category,
    categoryLabel,
    categoryColor,
    dialogue: dialogueText,
    bestSan,
    bestSanHint,
    mood: selectedTemplate.mood,
    formattedMarkdown,
    avatarChar: meta.avatarChar,
    themeColor: meta.themeColor,
  };
}
