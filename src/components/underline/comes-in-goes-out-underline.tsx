import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls, type ValueAnimationTransition } from "motion/react";

import { cn } from "@/lib/utils";

type Direction = "left" | "right";

type Props<T extends ElementType> = {
  children: ReactNode;
  as?: T;
  direction?: Direction;
  className?: string;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
  transition?: ValueAnimationTransition;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function ComesInGoesOutUnderline<T extends ElementType = "span">({
  children,
  as,
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = { duration: 0.4, ease: "easeInOut" },
  ...props
}: Props<T>) {
  const controls = useAnimationControls();
  const [blocked, setBlocked] = useState(false);
  const textRef = useRef<HTMLElement | null>(null);
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as]);

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (!textRef.current) return;
      const styles = getComputedStyle(textRef.current);
      const fontSize = parseFloat(styles.fontSize);
      const underlineHeight = fontSize * underlineHeightRatio;
      const underlinePadding = fontSize * underlinePaddingRatio;
      const textWidth =
        textRef.current.querySelector("[data-underline-text]")?.getBoundingClientRect().width ??
        textRef.current.getBoundingClientRect().width;
      textRef.current.style.setProperty("--underline-height", `${underlineHeight}px`);
      textRef.current.style.setProperty("--underline-padding", `${underlinePadding}px`);
      textRef.current.style.setProperty("--underline-width", `${textWidth}px`);
    };

    updateUnderlineStyles();
    window.addEventListener("resize", updateUnderlineStyles);
    return () => window.removeEventListener("resize", updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio]);

  const animate = async () => {
    if (blocked) return;

    setBlocked(true);

    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    });

    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    });

    setBlocked(false);
  };

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
      ref={textRef}
      {...props}
    >
      <span className="relative z-10 inline-block" data-underline-text>
        {children}
      </span>
      <motion.span
        className={cn("absolute bg-current w-0", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(1 * var(--underline-padding))",
          width: "var(--underline-width, 100%)",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  );
}

ComesInGoesOutUnderline.displayName = "ComesInGoesOutUnderline";
