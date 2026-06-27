import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface IntroProps {
  planImage: string;
  solidImage?: string;
  houseName: string;
  layoutText: string;
}

// 柔和的“加速-缓停”曲线,避免猛起骤停的顿挫感。
const SOFT = Easing.bezier(0.37, 0, 0.2, 1);
// 接近匀速、只在两端轻微缓动,用于持续运镜(Ken Burns)。
const DRIFT = Easing.bezier(0.45, 0.1, 0.4, 1);

function lerp(frame: number, range: number[], out: number[], easing = SOFT) {
  return interpolate(frame, range, out, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

// 做法二:真实 2D 户型图当贴图,做连续运镜式的翻转 + 拉升,
// 在模糊交叉中过渡到真实 3D 立体效果图,结尾缓慢漂移收尾。
export function IntroComposition({ planImage, solidImage, houseName, layoutText }: IntroProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;

  // —— 整体镜头:全程极缓慢推近,任何时刻都在动,避免静止顿感。
  const stageZoom = lerp(frame, [0, s(5.2)], [1.0, 1.05], DRIFT);

  // —— 2D 户型图:先轻推近,再像纸张一样缓缓向后躺下,同时上抬、发虚。
  const planTilt = lerp(frame, [s(0.8), s(2.4), s(3.7)], [0, 16, 72]);
  const planScale = lerp(frame, [s(0), s(2.4), s(3.7)], [1.0, 1.08, 1.18]);
  const planLift = lerp(frame, [s(0.8), s(3.7)], [0, -34]);
  const planBlur = lerp(frame, [s(2.4), s(3.5)], [0, 12]);
  const planOpacity = lerp(frame, [s(2.5), s(3.6)], [1, 0]);

  // —— 3D 效果图:从下方略带俯仰角托起,由虚转实接管,然后缓慢漂移收尾。
  const solidTilt = lerp(frame, [s(2.6), s(4.3)], [20, 0]);
  const solidScale = lerp(frame, [s(2.6), s(4.3), s(5.2)], [1.16, 1.02, 1.0], DRIFT);
  const solidLift = lerp(frame, [s(2.6), s(4.3), s(5.2)], [46, 0, -8]);
  const solidBlur = lerp(frame, [s(2.6), s(3.7)], [14, 0]);
  const solidOpacity = lerp(frame, [s(2.7), s(3.9)], [0, 1]);

  // —— 整体淡入 + 标题
  const fadeIn = lerp(frame, [0, s(0.5)], [0, 1]);
  const titleIn = lerp(frame, [s(0.25), s(1.1)], [0, 1]);
  const titleOut = lerp(frame, [s(2.2), s(3.0)], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(120% 90% at 50% 38%, #eef7f1 0%, #e2efe8 55%, #d8e7df 100%)",
        opacity: fadeIn,
      }}
    >
      {/* 立体透视舞台 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          perspective: "1500px",
          perspectiveOrigin: "50% 44%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${stageZoom})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* 真实 2D 户型图:翻转、拉升、发虚 */}
          <Img
            src={planImage}
            style={{
              position: "absolute",
              width: "60%",
              maxWidth: 700,
              borderRadius: 14,
              boxShadow: "0 46px 90px rgba(20,45,38,0.30)",
              opacity: planOpacity,
              filter: `blur(${planBlur}px)`,
              transform: `translateY(${planLift}px) rotateX(${planTilt}deg) scale(${planScale})`,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity, filter",
            }}
          />

          {/* 真实 3D 立体效果图:托起、由虚转实、缓慢漂移 */}
          {solidImage ? (
            <Img
              src={solidImage}
              style={{
                position: "absolute",
                width: "82%",
                maxWidth: 1040,
                borderRadius: 12,
                opacity: solidOpacity,
                filter: `blur(${solidBlur}px)`,
                transform: `translateY(${solidLift}px) rotateX(${solidTilt}deg) scale(${solidScale})`,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
              }}
            />
          ) : null}
        </div>
      </AbsoluteFill>

      {/* 标题 */}
      <AbsoluteFill
        style={{
          opacity: titleIn * titleOut,
          padding: "56px 64px",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(255,253,244,0.82)",
            borderRadius: 18,
            padding: "16px 22px",
            boxShadow: "0 10px 30px rgba(20,40,35,0.12)",
          }}
        >
          <div style={{ fontSize: 22, color: "#0f8f87", fontWeight: 600 }}>正在生成 3D 立体户型</div>
          <div style={{ fontSize: 34, color: "#1d2c28", fontWeight: 700, marginTop: 6 }}>{houseName}</div>
          <div style={{ fontSize: 20, color: "#52635d", marginTop: 4 }}>{layoutText}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
