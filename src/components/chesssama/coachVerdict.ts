import { CHARACTERS_ROSTER, type CharacterEntry } from "./characterData";

export interface CoachVerdict {
    speakerName: string;
    speakerTitle: string;
    avatarImage: string;
    themeColor: string;
    verdictText: string;
    badgeLabel: string;
    badgeColor: string;
}

export function getCoachReviewVerdict(
    characterId: string,
    accuracy: number,
    isWhite: boolean = true,
): CoachVerdict {
    // Resolve active character
    const charId =
        !characterId || characterId === "auto"
            ? isWhite
                ? "white_queen"
                : "black_queen"
            : characterId;

    const char: CharacterEntry =
        CHARACTERS_ROSTER.find((c) => c.id === charId) || CHARACTERS_ROSTER[0];

    const name = char.name;
    const isHigh = accuracy >= 90;
    const isMed = accuracy >= 75;

    let verdictText = "";

    if (charId.includes("queen")) {
        if (charId === "white_queen") {
            if (isHigh) {
                verdictText =
                    "Master... that accuracy was breathtaking and so commanding! You had total control over every single square... my heart won't stop fluttering for you! ♡";
            } else if (isMed) {
                verdictText =
                    "A passionate and spicy battle, Master! We had a few wild moments, but your dominant spirit carried us through... fufu. ♡";
            } else {
                verdictText =
                    "Kyaaa! Master, that was a dangerously reckless game! So many blunders and exposed pieces... you need private tactical discipline with me right away, b-baka!";
            }
        } else {
            // black_queen (Morgana)
            if (isHigh) {
                verdictText =
                    "Oh my... watching you ravage the opponent with such cold, ruthless precision sent wicked pleasure straight to my core... You may claim any reward you desire from your Queen tonight, Master... ♡";
            } else if (isMed) {
                verdictText =
                    "Fufu, a delightfully sadistic struggle! You toyed with their defenses before crushing their spirit... but don't get complacent, or I'll make you squirm under my heel next.";
            } else {
                verdictText =
                    "How pathetic... leaving yourself completely uncovered like a helpless rookie! You deserve strict physical correction for those blunders... Strip off your pride and let me discipline you properly! ♡";
            }
        }
    } else if (charId.includes("knight")) {
        if (charId === "white_knight") {
            if (isHigh) {
                verdictText =
                    "Haa... haa... Master, you rode across the board like a storm god! My whole body is flushed and trembling with adrenaline from your commands! ♡";
            } else if (isMed) {
                verdictText =
                    "That was an intense, sweaty clash! A few messy jumps, but you fought hard! Let's hit the baths together to cool down... e-eh? Together?!";
            } else {
                verdictText =
                    "Kyaaa! Master, what kind of reckless maneuvers were those?! You threw away our pieces and left us exposed! I'm going to pin you down and drill tactics into you until morning!";
            }
        } else {
            // black_knight (Roxanne)
            if (isHigh) {
                verdictText =
                    "Heh, lethal and sharp as a dagger in the dark. You cut through their throats before they even saw the shadow falling. Deliciously executed, partner. ♡";
            } else if (isMed) {
                verdictText =
                    "Messy skirmish, but I like the dirt on you. A couple sloppy footsteps, but your finishing blow was filthy enough to make me grin.";
            } else {
                verdictText =
                    "Tch! What a circus! You tripped over your own feet and fell right into their lap! Get your act together before I tie you up as bait for the enemy!";
            }
        }
    } else if (charId.includes("bishop")) {
        if (charId === "white_bishop") {
            if (isHigh) {
                verdictText =
                    "A sanctified triumph! The divine diagonals sang with celestial harmony under your hand... Even my sacred robes tremble with pious ecstasy for you, Master! ♡";
            } else if (isMed) {
                verdictText =
                    "The lotus petals swayed in turbulence, but your faith endured. A passionate, spiritually charged duel that purifies our temple.";
            } else {
                verdictText =
                    "The heavens weep at such profane blunders! Master, your impure focus has defiled our sacred files! Kneel before the altar for immediate spiritual purification!";
            }
        } else {
            // black_bishop (Vespera)
            if (isHigh) {
                verdictText =
                    "The dark ritual is complete... Ahhn, your dark tactical sorcery has bound the enemy's soul forever. Come closer and taste the nectar of the eclipse... ♡";
            } else if (isMed) {
                verdictText =
                    "Fufufu, the blood sacrifice was turbulent, but the hexes took hold in the end. A delightfully forbidden performance.";
            } else {
                verdictText =
                    "Careless mortal! You severed the dark pentagram with your clumsy hands! For that blunder, you will serve as my experimental test subject tonight!";
            }
        }
    } else if (charId.includes("king")) {
        if (charId === "white_king") {
            if (isHigh) {
                verdictText =
                    "A display of peerless royal sovereignty. You conducted this army with majestic brilliance, commander. Even this King's heart quickens with deep admiration...";
            } else if (isMed) {
                verdictText =
                    "A valorous and hard-fought victory. There were turbulent tides, but your sovereign resolve prevailed upon the battlefield.";
            } else {
                verdictText =
                    "Unacceptable carelessness! Leaving the sovereign flanks defenseless invites catastrophe! You shall undergo immediate royal retraining under my personal supervision!";
            }
        } else {
            // black_king (Malakor)
            if (isHigh) {
                verdictText =
                    "Magnificent slaughter. You crushed them beneath the iron heel of dusk with perfection. You have proven worthy to stand at my side as an equal.";
            } else if (isMed) {
                verdictText =
                    "Passable carnage. You allowed them to breathe a little too long, but the throne remains firmly in our grasp.";
            } else {
                verdictText =
                    "Disgraceful weakness. A blunder-riddled mess that insults the dark crown. Kneel and prepare to face the consequences of your incompetence.";
            }
        }
    } else {
        // Default fallback (Pawns / Rooks)
        if (isHigh) {
            verdictText = `Master, that ${accuracy.toFixed(1)}% accuracy was absolute dominance! Every command you gave resonated with flawless brilliance! ♡`;
        } else if (isMed) {
            verdictText = `A fierce and passionate battle! A few wild swings, but your tactical determination won the day! ♡`;
        } else {
            verdictText = `Kyaaa! That was way too dangerous! So many pieces caught unprotected... Master, you need intense private training right now!`;
        }
    }

    const badgeColor = isHigh ? "teal" : isMed ? "pink" : "red";

    return {
        speakerName: name,
        speakerTitle: char.title,
        avatarImage: char.iconImage || char.heroImage,
        themeColor: char.side === "white" ? "#F4A6C6" : "#D4AF37",
        verdictText,
        badgeLabel: `${name}'s Game Review Verdict`,
        badgeColor,
    };
}
