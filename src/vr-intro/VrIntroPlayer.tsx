import { Player, type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useRef } from "react";
import { IntroComposition, type IntroProps } from "./IntroComposition";

interface VrIntroPlayerProps {
  planImage: string;
  solidImage?: string;
  houseName: string;
  layoutText: string;
  onFinish: () => void;
  onSkip: () => void;
}

const FPS = 30;
const DURATION_IN_FRAMES = 168; // 5.6 秒

export function VrIntroPlayer({
  planImage,
  solidImage,
  houseName,
  layoutText,
  onFinish,
  onSkip,
}: VrIntroPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const finishedRef = useRef(false);

  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleEnded = () => finishOnce();
    const handleFrame = (e: { detail: { frame: number } }) => {
      if (e.detail.frame >= DURATION_IN_FRAMES - 1) finishOnce();
    };
    player.addEventListener("ended", handleEnded);
    player.addEventListener("frameupdate", handleFrame);

    const timer = window.setTimeout(finishOnce, (DURATION_IN_FRAMES / FPS) * 1000 + 400);

    return () => {
      player.removeEventListener("ended", handleEnded);
      player.removeEventListener("frameupdate", handleFrame);
      window.clearTimeout(timer);
    };
  }, [finishOnce]);

  const inputProps: IntroProps = { planImage, solidImage, houseName, layoutText };

  return (
    <div className="vr-intro-layer">
      <Player
        ref={playerRef}
        component={IntroComposition}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        compositionWidth={1280}
        compositionHeight={720}
        inputProps={inputProps}
        autoPlay
        loop={false}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        initiallyMuted
        moveToBeginningWhenEnded={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
      <button type="button" className="vr-intro-skip" onClick={onSkip}>
        跳过动画,直接看房
      </button>
    </div>
  );
}
