import { describe, expect, it } from "vitest";
import { getCoachReviewVerdict } from "@/components/chesssama/coachVerdict";

describe("getCoachReviewVerdict", () => {
  it("generates seductive high accuracy verdict for Seraphine", () => {
    const verdict = getCoachReviewVerdict("white_queen", 95, true);
    expect(verdict.speakerName).toBe("Seraphine");
    expect(verdict.badgeColor).toBe("teal");
    expect(verdict.verdictText).toContain("Master... that accuracy was breathtaking");
  });

  it("generates strict discipline low accuracy verdict for Seraphine", () => {
    const verdict = getCoachReviewVerdict("white_queen", 60, true);
    expect(verdict.speakerName).toBe("Seraphine");
    expect(verdict.badgeColor).toBe("red");
    expect(verdict.verdictText).toContain("tactical discipline with me right away");
  });

  it("generates ruthless seductive high accuracy verdict for Lilith", () => {
    const verdict = getCoachReviewVerdict("black_queen", 92, false);
    expect(verdict.speakerName).toBe("Lilith");
    expect(verdict.badgeColor).toBe("teal");
    expect(verdict.verdictText).toContain("ravage the opponent with such cold, ruthless precision");
  });

  it("generates spirited knight verdict for Dame Freya", () => {
    const verdict = getCoachReviewVerdict("white_knight", 80, true);
    expect(verdict.speakerName).toBe("Dame Freya");
    expect(verdict.badgeColor).toBe("pink");
    expect(verdict.verdictText).toContain("intense, sweaty clash");
  });

  it("generates sovereign decree for Aurelian", () => {
    const verdict = getCoachReviewVerdict("white_king", 91, true);
    expect(verdict.speakerName).toBe("Aurelian");
    expect(verdict.verdictText).toContain("peerless royal sovereignty");
  });
});
