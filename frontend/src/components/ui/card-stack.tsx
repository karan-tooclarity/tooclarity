"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

let interval: NodeJS.Timeout | undefined;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset = 12, // Distance between stacked cards
  scaleFactor = 0.05, // Slight scaling for depth effect
  autoFlip = true, // Auto-flipping enabled by default
  flipInterval = 5000, // Flip every 5 seconds
  containerHeight = "600px", // Make stack height adjustable
  containerWidth = "100%", // Make stack width adjustable
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  autoFlip?: boolean;
  flipInterval?: number;
  containerHeight?: string;
  containerWidth?: string;
}) => {
  const [cards, setCards] = useState<Card[]>(items);

  const startFlipping = useCallback(() => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!); // move last to front
        return newArray;
      });
    }, flipInterval);
  }, [flipInterval]);

  useEffect(() => {
    if (autoFlip) {
      startFlipping();
    }
    return () => clearInterval(interval);
  }, [autoFlip, startFlipping]);

  return (
    <div
      className="relative mx-auto"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-white dark:bg-black rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-white/[0.1] 
                     shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between transition-all duration-500 ease-in-out"
          style={{
            transformOrigin: "top center",
            height: "100%", // Full height inside container
            width: "100%", // Full width inside container
          }}
          animate={{
            top: index * -offset,
            scale: 1 - index * scaleFactor,
            zIndex: cards.length - index,
          }}
        >
          {/* Card Content */}
          <div className="overflow-auto">{card.content}</div>

          {/* Footer */}
          <div className="mt-4">
            <p className="text-neutral-500 font-medium dark:text-white">
              {card.name}
            </p>
            <p className="text-neutral-400 font-normal dark:text-neutral-200">
              {card.designation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
