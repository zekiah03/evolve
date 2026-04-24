"use client";

import { motion } from "framer-motion";

export function SimulatingScreen() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="text-center space-y-8">
        <p className="font-serif-jp text-xs tracking-[0.4em] text-muted">
          SIMULATING
        </p>
        <motion.h2
          className="font-serif-jp text-2xl leading-relaxed tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          六つの時代を、
          <br />
          生き抜いていく…
        </motion.h2>
        <div className="mx-auto h-px w-24 bg-line overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "50%" }}
          />
        </div>
      </div>
    </main>
  );
}
