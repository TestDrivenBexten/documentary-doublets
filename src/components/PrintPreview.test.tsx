import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PrintPreview } from "./PrintPreview";

const verseMap = new Map([
    [1, { text: "English verse", heText: "בְּרֵאשִׁית" }],
    [2, { text: "Second verse", heText: "וְהָאָרֶץ" }],
]);

describe("PrintPreview", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders Hebrew verses with verse numbers by default", () => {
        // Arrange
        const onClose = vi.fn();

        // Act
        render(<PrintPreview verseMap={verseMap} onClose={onClose} />);

        // Assert
        expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
        expect(screen.getByText("בְּרֵאשִׁית")).toBeInTheDocument();
        expect(screen.getByText("וְהָאָרֶץ")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("prints and closes through the supported controls", () => {
        // Arrange
        const onClose = vi.fn();
        const print = vi.fn();
        vi.stubGlobal("print", print);
        render(<PrintPreview verseMap={verseMap} onClose={onClose} />);

        // Act
        fireEvent.click(screen.getByRole("button", { name: "Print" }));
        fireEvent.keyDown(document, { key: "Escape" });

        // Assert
        expect(print).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("closes when the overlay is clicked", () => {
        // Arrange
        const onClose = vi.fn();
        render(<PrintPreview verseMap={verseMap} onClose={onClose} />);

        // Act
        fireEvent.click(screen.getByRole("presentation"));

        // Assert
        expect(onClose).toHaveBeenCalledOnce();
    });
});