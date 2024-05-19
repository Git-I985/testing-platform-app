import * as React from "react";
import { useState } from "react";

export function useHandleAutoFill() {
  const [isAutoFill, setIsAutoFill] = useState(false);

  return {
    inputHandleAutofillProps: {
      onAnimationStart: (e: React.AnimationEvent<HTMLDivElement>) => {
        e.animationName === "mui-auto-fill" && setIsAutoFill(true);
      },
      onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) =>
        e.animationName === "mui-auto-fill-cancel" && setIsAutoFill(false),
      onFocus: () => setIsAutoFill(false),
    },
    inputLabelProps: {
      shrink: isAutoFill || undefined,
    },
  };
}