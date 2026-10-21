import { useState, useEffect } from "react";
import {
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Card,
  SimpleGrid,
  SegmentedControl,
  Button,
  ScrollArea,
  Box,
  Divider,
  Image,
} from "@mantine/core";
import {
  IconSparkles,
  IconArrowsExchange,
  IconVolume,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { galleryOpenAtom } from "@/state/atoms";
import { CHARACTERS_ROSTER } from "./characterData";
import { playAnimeSfx } from "@/utils/sound";
import { generateAnimeMoveCommentary, type DialogueCategory } from "./animeDialogue";

export function GalleryModal() {
  const [opened, setOpened] = useAtom(galleryOpenAtom);
  const [filterSide, setFilterSide] = useState<string>("all");
  const [selectedCharId, setSelectedCharId] = useState<string>("white_queen");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [activeMediaTab, setActiveMediaTab] = useState<string>("idle");
  const [previewCategory, setPreviewCategory] = useState<DialogueCategory>("brilliant");

  // Global hotkey Ctrl+G listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setOpened((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpened]);

  const selectedChar =
    CHARACTERS_ROSTER.find((c) => c.id === selectedCharId) || CHARACTERS_ROSTER[0];

  // For compare mode: find the counterpart character (White <-> Black)
  const counterpartId = selectedChar.side === "white"
    ? `black_${selectedChar.pieceType}`
    : `white_${selectedChar.pieceType}`;
  const counterpartChar =
    CHARACTERS_ROSTER.find((c) => c.id === counterpartId) || CHARACTERS_ROSTER[0];

  const filteredCharacters = CHARACTERS_ROSTER.filter((c) => {
    if (filterSide === "all") return true;
    return c.side === filterSide;
  });

  // Sample dialogue for preview
  const sampledDialogue = generateAnimeMoveCommentary({
    san: previewCategory === "checkmate" ? "Qxf7#" : previewCategory === "promotion" ? "e8=Q" : previewCategory === "capture" ? "Bxf7+" : "e4",
    annotation: previewCategory === "blunder" ? "??" : previewCategory === "brilliant" ? "!!" : previewCategory === "dubious" ? "?!" : "!",
    color: selectedChar.side,
    preferredCharacterId: selectedChar.id,
  });

  const handlePreviewDialogue = (cat: DialogueCategory) => {
    setPreviewCategory(cat);
    if (cat === "brilliant") playAnimeSfx("brilliant");
    else if (cat === "blunder") playAnimeSfx("blunder");
    else if (cat === "promotion") playAnimeSfx("promotion");
    else if (cat === "checkmate") playAnimeSfx("checkmate");
    else playAnimeSfx("cutin");
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      position="right"
      size="75%"
      title={
        <Group justify="space-between" w="100%">
          <Group gap="xs">
            <IconSparkles color="#F4A6C6" size="1.8rem" />
            <Title order={3} c="#FFF8F6" fw={700}>
              Croissant_Sama Character Codex
            </Title>
            <Badge color="pink" variant="light" size="sm">
              All 12 Piece Sovereigns
            </Badge>
          </Group>
          <Text c="dimmed" size="xs" mr="xl">
            Shortcut: <kbd style={{ background: "#2A2A35", padding: "2px 6px", borderRadius: 4 }}>Ctrl+G</kbd>
          </Text>
        </Group>
      }
      styles={{
        header: {
          background: "#15151C",
          borderBottom: "1px solid #2A2A35",
        },
        body: {
          background: "#111116",
          height: "calc(100% - 60px)",
          padding: 0,
        },
      }}
    >
      <Group align="flex-start" h="100%" gap={0}>
        {/* Left Column: 12-Character Roster Grid */}
        <Box
          w="340px"
          h="100%"
          p="md"
          style={{
            borderRight: "1px solid #2A2A35",
            background: "#15151C",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SegmentedControl
            value={filterSide}
            onChange={setFilterSide}
            data={[
              { label: "All (12)", value: "all" },
              { label: "Dawn (White)", value: "white" },
              { label: "Dusk (Black)", value: "black" },
            ]}
            color="pink"
            fullWidth
            mb="md"
          />

          <ScrollArea flex={1} offsetScrollbars>
            <SimpleGrid cols={2} spacing="xs">
              {filteredCharacters.map((char) => {
                const isSelected = char.id === selectedCharId;
                const isWhite = char.side === "white";
                return (
                  <Card
                    key={char.id}
                    p="xs"
                    radius="md"
                    onClick={() => {
                      setSelectedCharId(char.id);
                      setActiveMediaTab("idle");
                    }}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? isWhite
                          ? "rgba(244, 166, 198, 0.18)"
                          : "rgba(212, 175, 55, 0.18)"
                        : "#1A1A24",
                      border: isSelected
                        ? `2px solid ${isWhite ? "#F4A6C6" : "#D4AF37"}`
                        : "1px solid #2A2A35",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Box
                      h="80px"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isWhite ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.4)",
                        borderRadius: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Image
                        src={char.iconImage}
                        alt={char.name}
                        fit="contain"
                        h="65px"
                        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}
                      />
                    </Box>
                    <Text size="xs" fw={700} truncate c={isWhite ? "#FFF8F6" : "#D4AF37"}>
                      {char.name}
                    </Text>
                    <Text size="10px" c="dimmed" tt="uppercase">
                      {char.pieceType} • {char.side}
                    </Text>
                  </Card>
                );
              })}
            </SimpleGrid>
          </ScrollArea>
        </Box>

        {/* Right Column: Character Inspection & Comparison View */}
        <ScrollArea flex={1} h="100%" p="xl">
          <Group justify="space-between" mb="lg">
            <Group gap="xs">
              <Badge
                color={selectedChar.side === "white" ? "pink" : "yellow"}
                variant="filled"
                size="md"
              >
                House of {selectedChar.side === "white" ? "Dawn" : "Dusk"}
              </Badge>
              <Badge variant="outline" color="gray" size="md">
                {selectedChar.pieceType.toUpperCase()}
              </Badge>
            </Group>
            <Button
              variant={compareMode ? "filled" : "light"}
              color="pink"
              size="xs"
              leftSection={<IconArrowsExchange size={16} />}
              onClick={() => setCompareMode((prev) => !prev)}
            >
              {compareMode ? "Single View" : "Mirror Compare (White vs Black)"}
            </Button>
          </Group>

          {!compareMode ? (
            /* Single Character Focus View */
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {/* Art Stage */}
              <Card
                radius="lg"
                p="md"
                style={{
                  background: "#181822",
                  border: "1px solid #2A2A35",
                  minHeight: "520px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box w="100%">
                  {(() => {
                    const tabs = [{ label: "Idle Art (9:16)", value: "idle" }];
                    if (selectedChar.actionImage) tabs.push({ label: "Combat Action", value: "action" });
                    if (selectedChar.specialImage) tabs.push({ label: "Special Climax", value: "special" });
                    tabs.push({ label: "Piece Icon", value: "piece" });
                    if (selectedChar.animationVideo) tabs.push({ label: "Loop (6s)", value: "video" });

                    const currentTab = tabs.some(t => t.value === activeMediaTab) ? activeMediaTab : "idle";
                    const activeImage =
                      currentTab === "action"
                        ? selectedChar.actionImage
                        : currentTab === "special"
                        ? selectedChar.specialImage
                        : currentTab === "piece"
                        ? selectedChar.iconImage
                        : selectedChar.heroImage;

                    return (
                      <>
                        <SegmentedControl
                          value={currentTab}
                          onChange={setActiveMediaTab}
                          data={tabs}
                          fullWidth
                          mb="md"
                          size="xs"
                          color="pink"
                        />
                        {currentTab === "video" && selectedChar.animationVideo ? (
                          <video
                            key={selectedChar.animationVideo}
                            src={selectedChar.animationVideo}
                            autoPlay
                            loop
                            muted
                            controls
                            playsInline
                            style={{
                              width: "100%",
                              maxHeight: "480px",
                              borderRadius: "12px",
                              objectFit: "contain",
                              background: "#0E0E14",
                            }}
                          />
                        ) : (
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "#0E0E14",
                              borderRadius: "12px",
                              padding: currentTab === "piece" ? "32px" : "0",
                              minHeight: "440px",
                            }}
                          >
                            <img
                              key={activeImage}
                              src={activeImage}
                              alt={selectedChar.name}
                              style={{
                                width: currentTab === "piece" ? "200px" : "100%",
                                maxHeight: "480px",
                                objectFit: "contain",
                                borderRadius: "12px",
                                filter: currentTab === "piece" ? "drop-shadow(0 8px 24px rgba(0,0,0,0.8))" : "none",
                              }}
                            />
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              </Card>

              {/* Character Lore, Voice Lines & Technical Details */}
              <Stack gap="md">
                <Box>
                  <Title order={2} c="#FFF8F6">
                    {selectedChar.name}
                  </Title>
                  <Text size="sm" c={selectedChar.side === "white" ? "#F4A6C6" : "#D4AF37"} fw={600}>
                    {selectedChar.title}
                  </Text>
                </Box>

                <Divider color="#2A2A35" />

                <Box>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={4}>
                    Character Lore
                  </Text>
                  <Text size="sm" c="#E0E0E8" lh={1.6}>
                    "{selectedChar.lore}"
                  </Text>
                </Box>

                {/* Interactive Dialogue Preview / Voice Lines */}
                <Card radius="md" p="md" bg="#161620" style={{ border: "1px solid #2A2A35" }}>
                  <Group justify="space-between" mb="xs">
                    <Group gap="xs">
                      <IconVolume size={18} color="#F4A6C6" />
                      <Text size="xs" fw={700} c="#FFF8F6" tt="uppercase">
                        Analysis Voice Commentary
                      </Text>
                    </Group>
                    <Badge size="xs" color="pink" variant="light">
                      Mood: {sampledDialogue.mood}
                    </Badge>
                  </Group>

                  <Group gap={6} mb="sm">
                    {(["brilliant", "blunder", "promotion", "dubious", "capture", "checkmate"] as DialogueCategory[]).map(
                      (cat) => (
                        <Button
                          key={cat}
                          size="compact-xs"
                          variant={previewCategory === cat ? "filled" : "light"}
                          color={cat === "blunder" ? "red" : cat === "brilliant" ? "cyan" : cat === "promotion" ? "pink" : "gray"}
                          onClick={() => handlePreviewDialogue(cat)}
                        >
                          {cat.toUpperCase()}
                        </Button>
                      ),
                    )}
                  </Group>

                  <Box p="xs" style={{ background: "#0F0F16", borderRadius: 6, borderLeft: "3px solid #F4A6C6" }}>
                    <Text size="xs" c="#F1F5F9" style={{ fontStyle: "italic", lineHeight: 1.5 }}>
                      "{sampledDialogue.dialogue}"
                    </Text>
                  </Box>
                </Card>

                <Card radius="md" p="md" bg="#161620" style={{ border: "1px solid #2A2A35" }}>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Hair & Features:</Text>
                      <Text size="xs" fw={600} c="#FFF8F6">{selectedChar.hair}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Signature Prop:</Text>
                      <Text size="xs" fw={600} c="#FFF8F6">{selectedChar.prop}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">House Uniform:</Text>
                      <Text size="xs" fw={600} c="#FFF8F6">{selectedChar.outfit}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            </SimpleGrid>
          ) : (
            /* Mirror Comparison View (White vs Black Side-by-Side) */
            <SimpleGrid cols={2} spacing="lg">
              {[selectedChar, counterpartChar].map((char) => {
                const isWhite = char.side === "white";
                return (
                  <Card
                    key={char.id}
                    radius="lg"
                    p="lg"
                    style={{
                      background: isWhite ? "#1A1720" : "#1A1916",
                      border: `1px solid ${isWhite ? "rgba(244, 166, 198, 0.3)" : "rgba(212, 175, 55, 0.3)"}`,
                    }}
                  >
                    <Badge
                      color={isWhite ? "pink" : "yellow"}
                      variant="filled"
                      size="sm"
                      mb="sm"
                    >
                      House of {isWhite ? "Dawn" : "Dusk"}
                    </Badge>
                    <Title order={3} c={isWhite ? "#FFF8F6" : "#D4AF37"}>
                      {char.name}
                    </Title>
                    <Text size="xs" c="dimmed" mb="md">
                      {char.title}
                    </Text>

                    <Box
                      h="380px"
                      style={{
                        background: isWhite ? "#262329" : "#14141A",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={char.heroImage}
                        alt={char.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    <Text size="xs" c="#E0E0E8" lh={1.5} mb="sm">
                      {char.lore}
                    </Text>
                    <Text size="11px" c="dimmed">
                      <strong>Uniform:</strong> {char.outfit}
                    </Text>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </ScrollArea>
      </Group>
    </Drawer>
  );
}
