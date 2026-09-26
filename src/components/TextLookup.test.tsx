import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchVerseTexts } from "../services/sefariaService";
import { TextLookup } from "./TextLookup";

vi.mock("../services/sefariaService", () => ({
    fetchVerseTexts: vi.fn(),
}));

describe("TextLookup print preview reference", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("defaults to Hebrew and keeps the submitted reference after the query is edited", async () => {
        // Arrange
        const fetchedVerses = new Map([
            [1, { text: "English verse", heText: "בְּרֵאשִׁית" }],
        ]);
        vi.mocked(fetchVerseTexts).mockResolvedValue(fetchedVerses);
        render(<TextLookup />);
        const input = screen.getByLabelText("Text Lookup");

        // Act
        fireEvent.change(input, { target: { value: "Micah 1:1-2" } });
        fireEvent.click(screen.getByRole("button", { name: "Look up" }));
        await screen.findByText("Micah 1:1-2");
        await screen.findByText("בְּרֵאשִׁית");
        fireEvent.change(input, { target: { value: "Genesis 2:3" } });
        fireEvent.click(screen.getByRole("button", { name: "Print preview" }));

        // Assert
        const preview = screen.getByRole("dialog");
        expect(within(preview).getByRole("heading", { name: "Micah 1:1-2" })).toBeInTheDocument();
        expect(within(preview).getByText("בְּרֵאשִׁית")).toBeInTheDocument();
    });
});