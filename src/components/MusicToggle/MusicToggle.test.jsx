import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const playMock = vi.fn(() => Promise.resolve());
const pauseMock = vi.fn();

class MockAudio {
  constructor() {
    this.volume = 1;
    this.loop = false;
    this.play = playMock;
    this.pause = pauseMock;
  }
}

vi.stubGlobal("Audio", MockAudio);

import MusicToggle from "./MusicToggle";

describe("MusicToggle", () => {
  beforeEach(() => {
    playMock.mockClear();
    pauseMock.mockClear();
  });

  it("renders the music toggle and starts in playing mode", () => {
    render(<MusicToggle />);

    expect(screen.getByTestId("music-toggle")).toHaveAttribute(
      "aria-label",
      "Mute music"
    );
    expect(playMock).toHaveBeenCalled();
  });

  it("toggles music off when clicked", () => {
    render(<MusicToggle />);

    fireEvent.click(screen.getByTestId("music-toggle"));

    expect(screen.getByTestId("music-toggle")).toHaveAttribute(
      "aria-label",
      "Play music"
    );
    expect(pauseMock).toHaveBeenCalled();
  });
});
