import { useState, useContext, useMemo } from "react";
import {
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Select,
  Tooltip,
  Collapse,
  Button,
  Box,
} from "@mantine/core";
import {
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconCrown,
  IconSwords,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useStore } from "zustand";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import {
  animeCoachCharacterAtom,
  animeCoachCollapsedAtom,
  animeCoachEnabledAtom,
  animeCoachShowPortraitAtom,
  animeCoachVideoModeAtom,
  galleryOpenAtom,
} from "@/state/atoms";
import { generateAnimeMoveCommentary, type AnimeDialogueResult } from "./animeDialogue";
import { CHARACTERS_ROSTER } from "./characterData";
import { formatScore } from "@/utils/score";
import { getNodeAtPath } from "@/utils/treeReducer";

export function AnimeCoachCard() {
  const [enabled, setEnabled] = useAtom(animeCoachEnabledAtom);
  const [characterId, setCharacterId] = useAtom(animeCoachCharacterAtom);
  const [collapsed, setCollapsed] = useAtom(animeCoachCollapsedAtom);
  const [showPortrait, setShowPortrait] = useAtom(animeCoachShowPortraitAtom);
  const [videoMode, setVideoMode] = useAtom(animeCoachVideoModeAtom);
  const [, setGalleryOpen] = useAtom(galleryOpenAtom);
  const [reRollCount, setReRollCount] = useState<number>(0);

  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);
  const currentNode = useStore(store, (s) => s.currentNode());
  const position = useStore(store, (s) => s.position);
  const goToMove = useStore(store, (s) => s.goToMove);

  // Find parent node to check for best line variations
  const parentNode = useMemo(() => {
    if (position.length === 0) return null;
    const parentPath = position.slice(0, -1);
    return getNodeAtPath(root, parentPath);
  }, [root, position]);

  // Check if parent has variation lines (best line suggested by engine)
  const bestLineNode = useMemo(() => {
    if (!parentNode || parentNode.children.length <= 1) return null;
    const variationChild = parentNode.children.find((c) => c.san && c.san !== currentNode.san);
    return variationChild || null;
  }, [parentNode, currentNode.san]);

  // Compute or extract anime commentary
  const commentary: AnimeDialogueResult = useMemo(() => {
    // If root position (game start)
    if (!currentNode.san || position.length === 0) {
      const isWhiteQueen = characterId.includes("black") ? false : true;
      return {
        speaker: isWhiteQueen ? "Seraphine" : "Seraphine (Dusk)",
        speakerTitle: isWhiteQueen
          ? "Sovereign of the Rose Dawn"
          : "Empress of the Twilight Eclipse",
        characterId: isWhiteQueen ? "white_queen" : "black_queen",
        category: "normal",
        categoryLabel: "Pre-Game Coach",
        categoryColor: "pink",
        dialogue:
          "Welcome back to the battlefield, Master... ♡ Show me your most disciplined, dominant moves today. I'm watching your every touch with breathless anticipation...",
        mood: "seductive",
        formattedMarkdown: "",
        avatarChar: "♕",
        themeColor: isWhiteQueen ? "#F4A6C6" : "#D4AF37",
      };
    }

    const color = currentNode.halfMoves % 2 === 1 ? "white" : "black";
    const annotation = currentNode.annotations[0];

    // Check if currentNode.comment already has a character comment
    if (currentNode.comment && reRollCount === 0) {
      const match = currentNode.comment.match(/\*\*([^:]+):\*\*\s*\*"([^"]+)"\*/);
      if (match) {
        const [, speaker, dialogue] = match;
        const char =
          CHARACTERS_ROSTER.find((c) => c.name.toLowerCase() === speaker.toLowerCase()) ||
          CHARACTERS_ROSTER[0];
        return {
          speaker,
          speakerTitle: char.title,
          characterId: char.id,
          category: annotation === "??" ? "blunder" : annotation === "?" ? "mistake" : "good",
          categoryLabel: annotation ? `Move ${annotation}` : "Analysis",
          categoryColor: annotation === "??" ? "red" : annotation === "?" ? "orange" : "pink",
          dialogue,
          bestSan: bestLineNode?.san || undefined,
          mood: "flustered",
          formattedMarkdown: currentNode.comment,
          avatarChar: char.pieceType === "queen" ? "♕" : char.pieceType === "knight" ? "♘" : "♗",
          themeColor: char.side === "white" ? "#F4A6C6" : "#D4AF37",
        };
      }
    }

    // Generate fresh dialogue
    const sanVariant = reRollCount > 0 ? `${currentNode.san}_${reRollCount}` : currentNode.san;

    return generateAnimeMoveCommentary({
      san: sanVariant,
      annotation,
      color,
      bestSan: bestLineNode?.san || undefined,
      preferredCharacterId: characterId,
    });
  }, [currentNode, position, reRollCount, characterId, bestLineNode]);

  // Find active character data entry
  const activeChar = useMemo(() => {
    return CHARACTERS_ROSTER.find((c) => c.id === commentary.characterId) || CHARACTERS_ROSTER[0];
  }, [commentary.characterId]);

  // Determine current active pose: Idle, Action, or Special
  const currentPose = useMemo<"idle" | "action" | "special">(() => {
    const san = currentNode.san;
    if (!san) return "idle";
    const annotation = currentNode.annotations[0];

    // Special Pose: Promotion (=), Checkmate (#), or Brilliant (!!)
    if (
      san.includes("=") ||
      san.includes("#") ||
      commentary.category === "checkmate" ||
      commentary.category === "brilliant" ||
      annotation === "!!"
    ) {
      return "special";
    }

    // Action Pose: Capture (x), Check (+), or Good move (!)
    if (
      san.includes("x") ||
      san.includes("+") ||
      commentary.category === "check" ||
      commentary.category === "good" ||
      annotation === "!" ||
      annotation === "!?"
    ) {
      return "action";
    }

    return "idle";
  }, [currentNode.san, currentNode.annotations, commentary.category]);

  // Determine image URL based on current pose
  const activeImageUrl = useMemo(() => {
    if (currentPose === "special" && activeChar.specialImage) {
      return activeChar.specialImage;
    }
    if ((currentPose === "action" || currentPose === "special") && activeChar.actionImage) {
      return activeChar.actionImage;
    }
    return activeChar.heroImage;
  }, [activeChar, currentPose]);

  // Pose badge styling
  const poseBadge = useMemo(() => {
    if (currentPose === "special") {
      return {
        label: "Special",
        color: "yellow",
        icon: <IconCrown size="0.65rem" />,
        shadow: "0 0 8px rgba(255, 212, 59, 0.7)",
      };
    }
    if (currentPose === "action") {
      return {
        label: "Action",
        color: "cyan",
        icon: <IconSwords size="0.65rem" />,
        shadow: "0 0 8px rgba(34, 184, 207, 0.7)",
      };
    }
    return {
      label: "Idle",
      color: "pink",
      icon: <IconSparkles size="0.65rem" />,
      shadow: "none",
    };
  }, [currentPose]);

  if (!enabled) {
    return (
      <Box px="xs" py={4}>
        <Button
          variant="subtle"
          color="pink"
          size="xs"
          leftSection={<IconSparkles size="0.8rem" />}
          onClick={() => setEnabled(true)}
        >
          Enable Anime Coach Talk
        </Button>
      </Box>
    );
  }

  const isBlunder = commentary.category === "blunder";
  const isBrilliant = commentary.category === "brilliant";
  const borderColor = isBlunder ? "#FF6B6B" : isBrilliant ? "#22B8CF" : commentary.themeColor;

  return (
    <Card
      p="xs"
      mx="xs"
      my={4}
      radius="md"
      style={{
        background: "linear-gradient(135deg, #15151C 0%, #1c1822 100%)",
        border: `1.5px solid ${borderColor}`,
        boxShadow: isBrilliant
          ? "0 0 14px rgba(34, 184, 207, 0.35)"
          : isBlunder
            ? "0 0 14px rgba(255, 107, 107, 0.35)"
            : currentPose === "special"
              ? "0 0 14px rgba(255, 212, 59, 0.4)"
              : "0 2px 8px rgba(0, 0, 0, 0.4)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Top Header Bar */}
      <Group justify="space-between" wrap="nowrap" mb={collapsed ? 0 : 6}>
        <Group gap="xs" wrap="nowrap">
          {/* Avatar Icon */}
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${borderColor} 0%, #2A2A35 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 8px ${borderColor}66`,
              flexShrink: 0,
            }}
          >
            <Text fz="1.1rem" lh={1} style={{ userSelect: "none" }}>
              {commentary.avatarChar}
            </Text>
          </Box>

          <Box style={{ minWidth: 0 }}>
            <Group gap={6} wrap="nowrap">
              <Text fz="xs" fw={700} c="#FFF8F6" truncate>
                {commentary.speaker}
              </Text>
              <Badge
                size="xs"
                variant="filled"
                color={commentary.categoryColor}
                styles={{ root: { textTransform: "none", fontWeight: 700 } }}
              >
                {commentary.categoryLabel}
              </Badge>
              {/* Dynamic Pose Reaction Badge */}
              <Badge
                size="xs"
                variant="light"
                color={poseBadge.color}
                leftSection={poseBadge.icon}
                style={{
                  boxShadow: poseBadge.shadow,
                  textTransform: "uppercase",
                  fontWeight: 800,
                  fontSize: "9px",
                }}
              >
                {poseBadge.label}
              </Badge>
            </Group>
            {!collapsed && (
              <Text fz="10px" c="dimmed" truncate>
                {commentary.speakerTitle}
              </Text>
            )}
          </Box>
        </Group>

        <Group gap={4} wrap="nowrap">
          {/* Toggle Portrait Art view */}
          <Tooltip
            label={showPortrait ? "Hide Character Portrait" : "Show Character Portrait"}
            position="top"
          >
            <ActionIcon
              size="sm"
              variant={showPortrait ? "light" : "subtle"}
              color="pink"
              onClick={() => setShowPortrait((v) => !v)}
            >
              <IconPhoto size="0.9rem" />
            </ActionIcon>
          </Tooltip>

          {/* Toggle Live Motion Video Animation */}
          {activeChar.animationVideo && (
            <Tooltip
              label={
                videoMode ? "Switch to Static Art Pose" : "Switch to Live Motion Animation (Video)"
              }
              position="top"
            >
              <ActionIcon
                size="sm"
                variant={videoMode ? "filled" : "subtle"}
                color="violet"
                onClick={() => setVideoMode((v) => !v)}
              >
                <IconVideo size="0.9rem" />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Open Gallery Drawer */}
          <Tooltip label="Open Art & Lore Gallery (Ctrl+G)" position="top">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="yellow"
              onClick={() => setGalleryOpen(true)}
            >
              <IconCrown size="0.9rem" />
            </ActionIcon>
          </Tooltip>

          {/* Re-roll anime dialogue button */}
          <Tooltip label="Re-roll Anime Dialogue" position="top">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="pink"
              onClick={() => setReRollCount((prev) => prev + 1)}
            >
              <IconSparkles size="0.9rem" />
            </ActionIcon>
          </Tooltip>

          {/* Coach Character Selector */}
          <Select
            size="xs"
            w={120}
            comboboxProps={{ withinPortal: true }}
            value={characterId}
            onChange={(val) => setCharacterId(val || "auto")}
            data={[
              { value: "auto", label: "Auto (Moving Piece)" },
              { value: "white_queen", label: "Seraphine (Queen)" },
              { value: "white_king", label: "Aurelian (King)" },
              { value: "white_bishop", label: "Lady Lumina (Bishop)" },
              { value: "white_knight", label: "Dame Freya (Knight)" },
              { value: "white_rook", label: "Lady Eleanor (Rook)" },
              { value: "white_pawn", label: "Dawn Squire (Pawn)" },
              { value: "black_queen", label: "Lilith (Dusk Queen)" },
              { value: "black_king", label: "Malakor (Dusk King)" },
              { value: "black_bishop", label: "Vespera (Dusk Bishop)" },
              { value: "black_knight", label: "Morwenna (Dusk Knight)" },
              { value: "black_rook", label: "Carmilla (Dusk Rook)" },
              { value: "black_pawn", label: "Dusk Squire (Pawn)" },
            ]}
            styles={{
              input: {
                background: "#1E1E28",
                borderColor: "#333345",
                fontSize: "11px",
                height: 24,
                minHeight: 24,
                paddingLeft: 6,
                paddingRight: 6,
              },
            }}
          />

          {/* Collapse/Expand Toggle */}
          <ActionIcon
            size="sm"
            variant="subtle"
            color="gray"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <IconChevronDown size="0.9rem" /> : <IconChevronUp size="0.9rem" />}
          </ActionIcon>
        </Group>
      </Group>

      {/* Collapsed view shows compact speech snippet */}
      {collapsed && (
        <Text fz="xs" fs="italic" c="#E5D9EC" lineClamp={1} mt={4}>
          "{commentary.dialogue}"
        </Text>
      )}

      {/* Expanded speech bubble & character portrait */}
      <Collapse in={!collapsed}>
        <Group align="flex-start" wrap="nowrap" gap="xs" mt={6}>
          {/* Dynamic Gacha Splash Portrait Thumbnail */}
          {showPortrait && activeImageUrl && (
            <Tooltip label={`View ${activeChar.name} in Gallery`} position="top">
              <Box
                onClick={() => setGalleryOpen(true)}
                style={{
                  position: "relative",
                  width: 82,
                  height: 112,
                  flexShrink: 0,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: poseBadge.shadow || `0 2px 8px rgba(0,0,0,0.5)`,
                  background: "#0D0D14",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {videoMode && activeChar.animationVideo ? (
                  <video
                    key={activeChar.animationVideo}
                    src={activeChar.animationVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                ) : (
                  <img
                    key={activeImageUrl}
                    src={activeImageUrl}
                    alt={commentary.speaker}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      transition: "opacity 0.2s ease",
                    }}
                  />
                )}
                {/* Pose / Video pill at bottom of art */}
                <Badge
                  size="compact-xs"
                  variant="filled"
                  color={videoMode && activeChar.animationVideo ? "violet" : poseBadge.color}
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: 2,
                    right: 2,
                    fontSize: "8.5px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    opacity: 0.92,
                  }}
                >
                  {videoMode && activeChar.animationVideo ? "LIVE 🎬" : currentPose}
                </Badge>
              </Box>
            </Tooltip>
          )}

          {/* Speech Bubble */}
          <Box
            p="xs"
            style={{
              flex: 1,
              minWidth: 0,
              background: "rgba(25, 23, 33, 0.8)",
              borderRadius: 8,
              borderLeft: `3px solid ${borderColor}`,
              position: "relative",
            }}
          >
            <Text fz="xs" fs="italic" c="#FFF5FB" style={{ lineHeight: 1.45 }}>
              "{commentary.dialogue}"
            </Text>

            {/* If there's an engine recommended best line, display interactive button */}
            {bestLineNode && bestLineNode.san && (
              <Group
                justify="space-between"
                align="center"
                mt="xs"
                pt={6}
                style={{ borderTop: "1px dashed rgba(255,255,255,0.12)" }}
              >
                <Group gap={6}>
                  <Badge size="xs" color="teal" variant="light">
                    Engine Best Move
                  </Badge>
                  <Text fz="xs" fw={700} c="#69DB7C">
                    {bestLineNode.san}
                    {bestLineNode.score ? ` (${formatScore(bestLineNode.score.value)})` : ""}
                  </Text>
                </Group>

                {parentNode && (
                  <Button
                    size="compact-xs"
                    variant="light"
                    color="teal"
                    rightSection={<IconArrowRight size="0.75rem" />}
                    onClick={() => {
                      const parentPath = position.slice(0, -1);
                      const varIndex = parentNode.children.findIndex(
                        (c) => c.san === bestLineNode.san,
                      );
                      if (varIndex !== -1) {
                        goToMove([...parentPath, varIndex]);
                      }
                    }}
                  >
                    View Best Line
                  </Button>
                )}
              </Group>
            )}
          </Box>
        </Group>
      </Collapse>
    </Card>
  );
}
