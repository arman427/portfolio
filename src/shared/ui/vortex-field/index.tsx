"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { startVortexStreet } from "./vortex-street";
import styles from "./VortexField.module.css";

type VortexFieldProps = {
    /** Positions and sizes the canvas; it fills its box. */
    className?: string;
};

/** A slow vortex street behind a section. Decoration only: no pointer input. */
export function VortexField({ className }: VortexFieldProps) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) return;
        return startVortexStreet(canvas.current);
    }, []);

    return (
        <canvas
            ref={canvas}
            aria-hidden="true"
            className={cn(styles.field, className)}
        />
    );
}
