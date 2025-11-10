"use client";

import React from "react";
import { motion } from "framer-motion";

const SuccessBadge: React.FC = () => {
  return (
    <div className="relative mx-auto mb-6 h-40 w-40 flex items-center justify-center">
      {/* Background pulse glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-100/60 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Expanding ripple */}
      <motion.div
        className="absolute h-24 w-24 rounded-full border border-blue-300"
        initial={{ scale: 0.4, opacity: 0.8 }}
        animate={{ scale: [0.4, 1.3], opacity: [0.8, 0] }}
        transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Core circle */}
      <motion.div
        className="relative flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
      >
        {/* Glowing inner ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-400/60"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 0.6, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated Check Mark (draws itself) */}
        <motion.svg
          viewBox="0 0 70 70"
          className="w-10 h-10 text-white relative z-10"
          fill="none"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M20 37 L30 47 L50 25"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </motion.div>

      {/* Outer soft shimmer border */}
      <motion.div
        className="absolute rounded-full border border-blue-400/30"
        style={{ width: "150%", height: "150%" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default SuccessBadge;
