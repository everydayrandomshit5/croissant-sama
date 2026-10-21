export type DialogueCategory =
    | "blunder"
    | "mistake"
    | "dubious"
    | "interesting"
    | "good"
    | "brilliant"
    | "novelty"
    | "best"
    | "capture"
    | "promotion"
    | "check"
    | "checkmate"
    | "normal";

export interface DialogueTemplate {
    text: string;
    mood:
        | "seductive"
        | "flustered"
        | "tsundere"
        | "ecstatic"
        | "pouting"
        | "proud"
        | "teasing"
        | "scared";
}

export type CharacterDialogueMap = Record<DialogueCategory, DialogueTemplate[]>;

export interface AnimeDialogueResult {
    speaker: string;
    speakerTitle: string;
    characterId: string;
    category: DialogueCategory;
    categoryLabel: string;
    categoryColor: string;
    dialogue: string;
    bestSan?: string;
    bestSanHint?: string;
    mood: DialogueTemplate["mood"];
    formattedMarkdown: string;
    avatarChar: string;
    themeColor: string;
}
