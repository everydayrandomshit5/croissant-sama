import { useEffect, useState, useContext, useRef } from "react";
import { Box, Group, Text, Title, Badge, Image, Transition } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useStore } from "zustand";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import { animeCutInsEnabledAtom, animeCoachCharacterAtom } from "@/state/atoms";
import { CHARACTERS_ROSTER } from "./characterData";
import { playAnimeSfx } from "@/utils/sound";
import { generateAnimeMoveCommentary } from "./animeDialogue";

interface CutInPayload {
  type: "brilliant" | "blunder" | "promotion" | "checkmate";
  title: string;
  subtitle: string;
  characterName: string;
  imageSrc: string;
  accentColor: string;
  bgGradient: string;
  quote: string;
}

export function AnimeCutInOverlay() {
  const enabled = useAtomValue(animeCutInsEnabledAtom);
  const preferredChar = useAtomValue(animeCoachCharacterAtom);
  const [activeCutIn, setActiveCutIn] = useState<CutInPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHandledMoveRef = useRef<string>("");

  const store = useContext(TreeStateContext);
  const currentNode = store ? useStore(store, (s) => s.currentNode()) : null;
  const position = store ? useStore(store, (s) => s.position) : null;

  useEffect(() => {
    if (!enabled || !currentNode || !position || position.length === 0) return;

    const moveKey = `${position.join("-")}:${currentNode.san}`;
    if (lastHandledMoveRef.current === moveKey) return;
    lastHandledMoveRef.current = moveKey;

    const san = currentNode.san || "";
    const annotation = currentNode.annotations[0];
    const isBlunder = annotation === "??";
    const isBrilliant = annotation === "!!";
    const isCheckmate = san.includes("#");
    const isPromotion = san.includes("=");

    if (!isBlunder && !isBrilliant && !isCheckmate && !isPromotion) {
      return;
    }

    const color = currentNode.halfMoves % 2 === 1 ? "white" : "black";
    const commentary = generateAnimeMoveCommentary({
      san,
      annotation,
      color,
      preferredCharacterId: preferredChar,
    });

    const charEntry =
      CHARACTERS_ROSTER.find((c) => c.id === commentary.characterId) ||
      CHARACTERS_ROSTER.find((c) => c.id === (color === "white" ? "white_queen" : "black_queen")) ||
      CHARACTERS_ROSTER[0];

    let type: CutInPayload["type"] = "brilliant";
    let title = "BRILLIANT STRIKE !!";
    let subtitle = "TACTICAL MASTERPIECE";
    let accentColor = "#38BDF8";
    let bgGradient =
      "linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)";

    if (isCheckmate) {
      type = "checkmate";
      title = "CHECKMATE !!";
      subtitle = "TOTAL CONQUEST";
      accentColor = "#F59E0B";
      bgGradient =
        "linear-gradient(135deg, rgba(245, 158, 11, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%)";
      playAnimeSfx("checkmate");
    } else if (isPromotion) {
      type = "promotion";
      title = "QUEEN ASCENSION ♕";
      subtitle = "ROYAL PROMOTION CLIMAX";
      accentColor = "#EC4899";
      bgGradient =
        "linear-gradient(135deg, rgba(236, 72, 153, 0.88) 0%, rgba(30, 10, 60, 0.96) 100%)";
      playAnimeSfx("promotion");
    } else if (isBlunder) {
      type = "blunder";
      title = "DISASTROUS BLUNDER ??";
      subtitle = "DEFENSES STRIPPED BARE";
      accentColor = "#EF4444";
      bgGradient =
        "linear-gradient(135deg, rgba(239, 68, 68, 0.88) 0%, rgba(20, 5, 10, 0.96) 100%)";
      playAnimeSfx("blunder");
    } else {
      playAnimeSfx("brilliant");
    }

    const imageSrc =
      type === "blunder"
        ? charEntry.heroImage
        : charEntry.actionImage || charEntry.specialImage || charEntry.heroImage;

    const payload: CutInPayload = {
      type,
      title,
      subtitle,
      characterName: charEntry.name,
      imageSrc,
      accentColor,
      bgGradient,
      quote: commentary.dialogue,
    };

    setActiveCutIn(payload);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveCutIn(null);
    }, 2400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentNode, position, enabled, preferredChar]);

  if (!enabled || !activeCutIn) return null;

  return (
    <Transition
      mounted={!!activeCutIn}
      transition="slide-left"
      duration={250}
      timingFunction="ease-out"
    >
      {(styles) => (
        <Box
          style={{
            ...styles,
            position: "absolute",
            top: "22%",
            left: 0,
            right: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Box
            onClick={() => setActiveCutIn(null)}
            style={{
              pointerEvents: "auto",
              cursor: "pointer",
              background: activeCutIn.bgGradient,
              boxShadow: `0 12px 36px rgba(0, 0, 0, 0.75), 0 0 24px ${activeCutIn.accentColor}66`,
              borderTop: `2px solid ${activeCutIn.accentColor}`,
              borderBottom: `2px solid ${activeCutIn.accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 24px",
              minHeight: "115px",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            {/* Left: Text & Quote */}
            <Box style={{ flex: 1, paddingRight: 16 }}>
              <Group gap="xs" mb={4}>
                <Badge
                  color={activeCutIn.type === "blunder" ? "red" : "yellow"}
                  variant="filled"
                  size="sm"
                  fw={800}
                  style={{ textTransform: "uppercase", letterSpacing: 1 }}
                >
                  {activeCutIn.subtitle}
                </Badge>
                <Text size="xs" fw={700} c={activeCutIn.accentColor}>
                  {activeCutIn.characterName}
                </Text>
              </Group>

              <Title
                order={2}
                c="#FFFFFF"
                style={{
                  textShadow: `0 2px 8px ${activeCutIn.accentColor}`,
                  letterSpacing: "0.05em",
                  fontSize: "1.45rem",
                  lineHeight: 1.1,
                }}
              >
                {activeCutIn.title}
              </Title>

              <Text
                size="xs"
                c="#F1F5F9"
                mt={4}
                style={{
                  fontStyle: "italic",
                  lineHeight: 1.3,
                  maxHeight: "3.6em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                "{activeCutIn.quote}"
              </Text>
            </Box>

            {/* Right: Character Cut-In Portrait */}
            <Box
              style={{
                width: "110px",
                height: "125px",
                flexShrink: 0,
                position: "relative",
                filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.8))`,
              }}
            >
              <Image
                src={activeCutIn.imageSrc}
                alt={activeCutIn.characterName}
                fit="contain"
                h="100%"
                w="100%"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Transition>
  );
}
