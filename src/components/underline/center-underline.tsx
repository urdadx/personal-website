"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { motion, type ValueAnimationTransition } from "motion/react";

import { cn } from "@/lib/utils";

type UnderlineProps<T extends ElementType> = {
  children: ReactNode;
  as?: T;
  className?: string;
  transition?: ValueAnimationTransition;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function CenterUnderline<T extends ElementType = "span">({
  children,
  as,
  className,
  transition = { duration: 0.25, ease: "easeInOut" },
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  ...props
}: UnderlineProps<T>) {
  const textRef = useRef<HTMLElement | null>(null);
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as]);

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (!textRef.current) return;
      const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize);
      const underlineHeight = fontSize * underlineHeightRatio;
      const underlinePadding = fontSize * underlinePaddingRatio;
      textRef.current.style.setProperty("--underline-height", `${underlineHeight}px`);
      textRef.current.style.setProperty("--underline-padding", `${underlinePadding}px`);
    };

    updateUnderlineStyles();
    window.addEventListener("resize", updateUnderlineStyles);
    return () => window.removeEventListener("resize", updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio]);

  const underlineVariants = {
    hidden: {
      width: 0,
      originX: 0.5,
    },
    visible: {
      width: "100%",
      transition,
    },
  };

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="visible"
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className="absolute left-1/2 -translate-x-1/2 bg-current"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
    </MotionComponent>
  );
}

CenterUnderline.displayName = "CenterUnderline";
