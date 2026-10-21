import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock Tauri APIs
const writtenFiles: Record<string, string[]> = {};
vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn(async (path: string, content: string, options?: { append?: boolean }) => {
    if (!writtenFiles[path] || !options?.append) {
      writtenFiles[path] = [];
    }
    writtenFiles[path].push(content);
  }),
}));

vi.mock("@tauri-apps/api/path", () => ({
  resolve: vi.fn(async (...args: string[]) => args.filter(Boolean).join("/")),
}));

vi.mock("@tauri-apps/plugin-log", () => ({
  info: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@mantine/notifications", () => ({
  notifications: {
    show: vi.fn(),
  },
}));

const mockFetch = vi.fn();
vi.mock("@tauri-apps/plugin-http", () => ({
  fetch: (...args: any[]) => mockFetch(...args),
}));

const emittedEvents: any[] = [];
vi.mock("@/bindings", () => ({
  events: {
    progressEvent: {
      emit: vi.fn((payload) => {
        emittedEvents.push(payload);
      }),
    },
  },
}));

vi.mock("../directories", () => ({
  getDatabasesDir: vi.fn(async () => "/mock/appdata/db"),
}));

describe("downloadChessCom", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    emittedEvents.length = 0;
    mockFetch.mockReset();
    for (const k of Object.keys(writtenFiles)) {
      delete writtenFiles[k];
    }
  });

  it("downloads games, formats with double newlines, and emits finished: true", async () => {
    const mockArchives = {
      archives: ["https://api.chess.com/pub/player/badatchess9586/games/2026/01"],
    };
    const mockGames = {
      games: [
        { pgn: '[Event "Game 1"]\n1. e4 e5 1-0' },
        { pgn: '[Event "Game 2"]\n1. d4 d5 0-1' },
      ],
    };

    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes("/games/archives")) {
        return {
          ok: true,
          json: async () => mockArchives,
        };
      }
      return {
        ok: true,
        json: async () => mockGames,
      };
    });

    const { downloadChessCom } = await import("../chess.com/api");

    const resultPath = await downloadChessCom("BadAtChess9586", null);

    expect(resultPath).toBe("/mock/appdata/db/BadAtChess9586_chesscom.pgn");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.chess.com/pub/player/badatchess9586/games/archives",
      expect.anything(),
    );

    const fileContent = writtenFiles[resultPath!];
    expect(fileContent).toBeDefined();
    // First element should be empty string (reset/init file)
    expect(fileContent[0]).toBe("");
    // Second element should have games joined with double newline and ending with double newline
    expect(fileContent[1]).toBe(
      '[Event "Game 1"]\n1. e4 e5 1-0\n\n[Event "Game 2"]\n1. d4 d5 0-1\n\n',
    );

    // Verify progress events
    expect(emittedEvents.length).toBeGreaterThanOrEqual(1);
    const lastEvent = emittedEvents[emittedEvents.length - 1];
    expect(lastEvent).toEqual({
      id: "chesscom_BadAtChess9586",
      progress: 100,
      finished: true,
    });
  });
});
