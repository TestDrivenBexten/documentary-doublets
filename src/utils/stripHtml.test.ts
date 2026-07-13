import { describe, it, expect } from "vitest";
import { stripHtml } from "./stripHtml";

describe("stripHtml", () => {
  it("returns plain text unchanged", () => {
    // Arrange
    const input = "Hello, world.";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("Hello, world.");
  });

  it("strips a simple HTML tag", () => {
    // Arrange
    const input = "<b>bold text</b>";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("bold text");
  });

  it("strips nested HTML tags", () => {
    // Arrange
    const input = "<p><em>italic</em> and <strong>bold</strong></p>";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("italic and bold");
  });

  it("collapses multiple whitespace characters into a single space", () => {
    // Arrange
    const input = "<p>word1   word2\t\nword3</p>";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("word1 word2 word3");
  });

  it("trims leading and trailing whitespace", () => {
    // Arrange
    const input = "  <span>  trimmed  </span>  ";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("trimmed");
  });

  it("returns an empty string for an empty input", () => {
    // Arrange
    const input = "";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("");
  });

  it("returns an empty string for a tag-only input", () => {
    // Arrange
    const input = "<br/>";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("");
  });

  it("preserves Hebrew and Unicode text", () => {
    // Arrange
    const input = "<span>בְּרֵאשִׁית</span>";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("בְּרֵאשִׁית");
  });

  it("neutralises a script injection attempt", () => {
    // Arrange
    const input = "<script>alert('xss')</script>safe text";

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("safe text");
    expect(result).not.toContain("script");
    expect(result).not.toContain("alert");
  });

  it("neutralises a malformed nested-tag XSS bypass", () => {
    // Arrange
    const input = "<scr<script>ipt>alert(1)</scr</script>ipt>";

    // Act
    const result = stripHtml(input);

    // Assert — no executable script tag; residual text is harmless
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("<");
  });

  it("strips an event-handler attribute injection", () => {
    // Arrange
    const input = '<img src="x" onerror="alert(1)">caption';

    // Act
    const result = stripHtml(input);

    // Assert
    expect(result).toBe("caption");
    expect(result).not.toContain("onerror");
  });
});
