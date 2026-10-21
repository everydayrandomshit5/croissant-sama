export interface CharacterVideo {
    title: string;
    src: string;
    type: "idle" | "action" | "special";
}

export interface CharacterEntry {
    id: string;
    name: string;
    title: string;
    pieceType: "queen" | "king" | "bishop" | "knight" | "rook" | "pawn";
    side: "white" | "black";
    hair: string;
    prop: string;
    outfit: string;
    lore: string;
    heroImage: string;
    actionImage?: string;
    specialImage?: string;
    iconImage: string;
    animationVideo?: string;
    videos?: CharacterVideo[];
}

export function getCharacterVideos(char: CharacterEntry): CharacterVideo[] {
    if (char.videos && char.videos.length > 0) {
        return char.videos;
    }
    const result: CharacterVideo[] = [];
    if (char.animationVideo) {
        result.push({
            title: "Idle Motion (Live2D)",
            src: char.animationVideo,
            type: "idle",
        });
    }
    return result;
}

export const CHARACTERS_ROSTER: CharacterEntry[] = [
    // White House (House of Dawn)
    {
        id: "white_queen",
        name: "Seraphine",
        title: "Sovereign of the Rose Dawn",
        pieceType: "queen",
        side: "white",
        hair: "Long wavy platinum with rose-pink ombre tips",
        prop: "Slender silver crystal scepter & rapier",
        outfit: "Layered ivory gown with silk rose-pink lining and ornate silver dress-armour",
        lore: "High Queen of the House of Dawn. Her strategic mastery orchestrates the battlefield with effortless grace and petal-laced authority.",
        heroImage: "/assets/chesssama/full/white_queen_idle.png",
        actionImage: "/assets/chesssama/full/white_queen_action.png",
        specialImage: "/assets/chesssama/full/white_queen_special.png",
        iconImage: "/pieces/chesssama/white_queen.png",
        animationVideo: "/assets/chesssama/animations/white_queen.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/white_queen.mp4",
                type: "idle",
            },
            {
                title: "Anime Motion (Idle)",
                src: "/assets/chesssama/animations/white_queen_idle.mp4",
                type: "idle",
            },
            {
                title: "Combat Strike (Live2D)",
                src: "/assets/chesssama/animations/white_queen_action.mp4",
                type: "action",
            },
            {
                title: "Climax Victory (Live2D)",
                src: "/assets/chesssama/animations/white_queen_special.mp4",
                type: "special",
            },
        ],
    },
    {
        id: "white_king",
        name: "Aurelian",
        title: "The Silver Sovereign",
        pieceType: "king",
        side: "white",
        hair: "Short neat swept-back silver hair",
        prop: "Slender ceremonial silver rapier & dawn astrolabe",
        outfit: "Tailored ivory ceremonial cloth coat with embroidered filigree and tall silver crown",
        lore: "Monarch of the Dawn Realm. His unwavering dignity and chivalric charm anchor the entire kingdom through the fiercest of sieges.",
        heroImage: "/assets/chesssama/full/white_king_idle.png",
        actionImage: "/assets/chesssama/full/white_king_action.png",
        specialImage: "/assets/chesssama/full/white_king_special.png",
        iconImage: "/pieces/chesssama/white_king.png",
        animationVideo: "/assets/chesssama/animations/white_king_idle.mp4",
        videos: [
            {
                title: "Anime Motion (Idle)",
                src: "/assets/chesssama/animations/white_king_idle.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "white_bishop",
        name: "Lady Lumina",
        title: "High Shrine Priestess of the Lotus Dawn",
        pieceType: "bishop",
        side: "white",
        hair: "Long pale lilac cascading locks with lotus kanzashi",
        prop: "Glowing crystal lotus staff with celestial talismans",
        outfit: "Ivory and sakura-pink Eastern priestess silk robes with lotus obi and detached sleeves",
        lore: "Celestial shrine maiden of the Dawn Court. Moving along sanctified diagonals, she purifies the board with lotus flames and sacred paper talismans.",
        heroImage: "/assets/chesssama/full/white_bishop_idle.png",
        actionImage: "/assets/chesssama/full/white_bishop_action.png",
        specialImage: "/assets/chesssama/full/white_bishop_special.png",
        iconImage: "/pieces/chesssama/white_bishop.png",
        animationVideo: "/assets/chesssama/animations/white_bishop.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/white_bishop.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "white_knight",
        name: "Dame Freya",
        title: "The Sunlit Valkyrie",
        pieceType: "knight",
        side: "white",
        hair: "High strawberry-blonde ponytail with pink ribbons",
        prop: "Tourney lance & silver sabre",
        outfit: "Form-fitting dress-armour with pink caparison, mounted on a majestic pure white warhorse",
        lore: "Leaping over any obstacle, Dame Freya commands the vanguard charge with fierce tsundere pride and radiant courage.",
        heroImage: "/assets/chesssama/full/white_knight_idle.png",
        actionImage: "/assets/chesssama/full/white_knight_action.png",
        specialImage: "/assets/chesssama/full/white_knight_special.png",
        iconImage: "/pieces/chesssama/white_knight.png",
        animationVideo: "/assets/chesssama/animations/white_knight.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/white_knight.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "white_rook",
        name: "Lady Eleanor",
        title: "The Aegis Sentinel",
        pieceType: "rook",
        side: "white",
        hair: "Long pearl-white battle braid",
        prop: "Tower heater shield and halberd",
        outfit: "Heavy silver-white plate armor with rose inlay and crenellated pauldron motifs",
        lore: "An immovable fortress in human form. Lady Eleanor turns back advancing legions with unbroken knightly resolve.",
        heroImage: "/assets/chesssama/full/white_rook_idle.png",
        actionImage: "/assets/chesssama/full/white_rook_action.png",
        specialImage: "/assets/chesssama/full/white_rook_special.png",
        iconImage: "/pieces/chesssama/white_rook.png",
        animationVideo: "/assets/chesssama/animations/white_rook.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/white_rook.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "white_pawn",
        name: "Dawn Squire",
        title: "The Devoted Vanguard",
        pieceType: "pawn",
        side: "white",
        hair: "Neat ribbon-tied flaxen ponytail",
        prop: "Short silver blade & dawn pennant",
        outfit: "Tailored white tunic with rose ribbons and light scout greaves",
        lore: "The heartbeat of the army. Step by patient step, every humble squire dreams of reaching the 8th rank to be crowned Queen by Senpai.",
        heroImage: "/assets/chesssama/full/white_pawn_idle.png",
        actionImage: "/assets/chesssama/full/white_pawn_action.png",
        specialImage: "/assets/chesssama/full/white_pawn_special.png",
        iconImage: "/pieces/chesssama/white_pawn.png",
    },

    // Black House (House of Dusk)
    {
        id: "black_queen",
        name: "Lilith",
        title: "The Abyssal Sovereign",
        pieceType: "queen",
        side: "black",
        hair: "Long wavy platinum with golden twilight highlights",
        prop: "Dark steel and antique gold scepter",
        outfit: "Charcoal velvet gown with antique gold filigree and dark steel shoulder pauldrons",
        lore: "Dominant empress of the House of Dusk. Ruling with velvet subtlety and golden iron, she commands the shadows and demands total submission.",
        heroImage: "/assets/chesssama/full/black_queen_idle.png",
        actionImage: "/assets/chesssama/full/black_queen_action.png",
        specialImage: "/assets/chesssama/full/black_queen_special.png",
        iconImage: "/pieces/chesssama/black_queen.png",
        animationVideo: "/assets/chesssama/animations/black_queen.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/black_queen.mp4",
                type: "idle",
            },
            {
                title: "Anime Motion (Idle)",
                src: "/assets/chesssama/animations/black_queen_idle.mp4",
                type: "idle",
            },
            {
                title: "Combat Strike (Live2D)",
                src: "/assets/chesssama/animations/black_queen_action.mp4",
                type: "action",
            },
            {
                title: "Climax Victory (Live2D)",
                src: "/assets/chesssama/animations/black_queen_special.mp4",
                type: "special",
            },
        ],
    },
    {
        id: "black_king",
        name: "Malakor",
        title: "The Obsidian Sovereign",
        pieceType: "king",
        side: "black",
        hair: "Short neat swept-back silver hair, bare head",
        prop: "Dark steel ceremonial blade and glowing eclipse orb",
        outfit: "Charcoal-black velvet ceremonial coat with gold filigree and three purple chest cabochons",
        lore: "Ruler of the Dusk Realm. Stoic, ruthless, and haughtily commanding, his quiet presence bends the flow of battle into darkness.",
        heroImage: "/assets/chesssama/full/black_king_idle.png",
        actionImage: "/assets/chesssama/full/black_king_action.png",
        specialImage: "/assets/chesssama/full/black_king_special.png",
        iconImage: "/pieces/chesssama/black_king.png",
    },
    {
        id: "black_bishop",
        name: "Vespera",
        title: "The Shadow Inquisitor",
        pieceType: "bishop",
        side: "black",
        hair: "Long pale lilac cascading locks with obsidian crescent kanzashi",
        prop: "Dark steel staff with obsidian crescent moon orb and spirit talismans",
        outfit: "Charcoal and antique gold Eastern priestess silk robes with obsidian obi sash and high leg slit",
        lore: "Pagan dark inquisitor of the Dusk Realm. Channeling midnight spirit flames and obsidian charms, she guards the dark diagonals with alluring wisdom.",
        heroImage: "/assets/chesssama/full/black_bishop_idle.png",
        actionImage: "/assets/chesssama/full/black_bishop_action.png",
        specialImage: "/assets/chesssama/full/black_bishop_special.png",
        iconImage: "/pieces/chesssama/black_bishop.png",
        animationVideo: "/assets/chesssama/animations/black_bishop.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/black_bishop.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "black_knight",
        name: "Morwenna",
        title: "The Eclipse Duelist",
        pieceType: "knight",
        side: "black",
        hair: "High strawberry-blonde ponytail with gold ribbons",
        prop: "Dark steel sabre and lance",
        outfit: "Black-and-gold dress-armour, mounted on a pitch-black midnight warhorse with gold barding",
        lore: "Flanking silently through the dark, Morwenna's midnight cavalry strikes with lightning thunder and chuunibyou edge.",
        heroImage: "/assets/chesssama/full/black_knight_idle.png",
        actionImage: "/assets/chesssama/full/black_knight_action.png",
        specialImage: "/assets/chesssama/full/black_knight_special.png",
        iconImage: "/pieces/chesssama/black_knight.png",
        animationVideo: "/assets/chesssama/animations/black_knight.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/black_knight.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "black_rook",
        name: "Carmilla",
        title: "The Dread Bastion",
        pieceType: "rook",
        side: "black",
        hair: "Long pearl-white battle braid",
        prop: "Dark steel tower shield and blood-forged warhammer",
        outfit: "Gunmetal plate armor etched with antique gold battlements and crimson gemstones",
        lore: "The bloodthirsty vampire countess of Dusk. Where Carmilla plants her shield, enemy armies are devoured and turned to dust.",
        heroImage: "/assets/chesssama/full/black_rook_idle.png",
        actionImage: "/assets/chesssama/full/black_rook_action.png",
        specialImage: "/assets/chesssama/full/black_rook_special.png",
        iconImage: "/pieces/chesssama/black_rook.png",
        animationVideo: "/assets/chesssama/animations/black_rook.mp4",
        videos: [
            {
                title: "Original Motion (Live2D)",
                src: "/assets/chesssama/animations/black_rook.mp4",
                type: "idle",
            },
        ],
    },
    {
        id: "black_pawn",
        name: "Dusk Squire",
        title: "The Bratty Vanguard",
        pieceType: "pawn",
        side: "black",
        hair: "Sleek raven-black high ponytail with antique gold ribbons",
        prop: "Short dark steel blade & eclipse crescent pennant",
        outfit: "Charcoal scout tunic with antique gold lacing and dark gunmetal greaves",
        lore: "Bratty, cheeky mesugaki kouhai. She mocks enemy mistakes and relentlessly advances forward to claim ultimate promotion into an elite Queen.",
        heroImage: "/assets/chesssama/full/black_pawn_idle.png",
        actionImage: "/assets/chesssama/full/black_pawn_action.png",
        specialImage: "/assets/chesssama/full/black_pawn_special.png",
        iconImage: "/pieces/chesssama/black_pawn.png",
    },
];
