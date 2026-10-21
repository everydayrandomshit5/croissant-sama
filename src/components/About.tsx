import { Anchor, Modal, Text, Title, Badge, Group, Stack } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { arch, version as OSVersion, type } from "@tauri-apps/plugin-os";
import { useEffect, useState } from "react";

function AboutModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [info, setInfo] = useState<{
    version: string;
    tauri: string;
    os: string;
    architecture: string;
    osVersion: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const os = await type();
        const version = await getVersion();
        const tauri = await getTauriVersion();
        const architecture = await arch();
        const osVersion = await OSVersion();
        setInfo({ version, tauri, os, architecture, osVersion });
      } catch {
        setInfo({ version: "0.15.1", tauri: "2.10.2", os: "web", architecture: "x86_64", osVersion: "10" });
      }
    }
    load();
  }, []);

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Group gap="xs">
          <IconSparkles size={20} color="#F4A6C6" />
          <Title order={4} c="#FFF8F6">
            Croissant_Sama (クロワッサン様)
          </Title>
        </Group>
      }
    >
      <Stack gap="xs">
        <Group gap="xs">
          <Badge color="pink" variant="light">
            Anime Desktop Chess
          </Badge>
          <Badge color="yellow" variant="light">
            v{info?.version || "0.15.1"}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" mt="xs">
          A bespoke anime chess GUI engineered with Tauri v2, Rust, React, Mantine, and Chessground.
          Featuring all 12 sovereigns of the House of Dawn and House of Dusk, real-time ecchi anime coaching, and dynamic combat cut-ins.
        </Text>

        <Text size="xs" c="dimmed" mt="sm">
          Desktop Engine: Tauri v{info?.tauri} • {info?.os} {info?.architecture} {info?.osVersion}
        </Text>
      </Stack>
    </Modal>
  );
}

export default AboutModal;
