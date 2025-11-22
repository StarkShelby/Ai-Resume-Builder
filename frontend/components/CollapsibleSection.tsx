"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleItemProps {
  title: string;
  content: string[];
  colorClass?: string;
  disableCollapse?: boolean; // New prop to disable collapse functionality
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  title,
  content,
  colorClass = "text-gray-800",
  disableCollapse = false, // Default to false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-2">
      {disableCollapse ? (
        // Render without button and arrow if collapse is disabled
        <h4 className={`font-semibold text-base ${colorClass} py-2`}>
          {title}
        </h4>
      ) : (
        // Render with button and arrow if collapse is enabled
        <button
          className="flex justify-between items-center w-full focus:outline-none py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h4 className={`font-semibold text-base ${colorClass}`}>{title}</h4>
          <motion.svg
            className={`w-5 h-5 ${colorClass}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </motion.svg>
        </button>
      )}

      {disableCollapse ? (
        // Always show content if collapse is disabled
        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm py-2">
          {content.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      ) : (
        // Conditionally show content with animation if collapse is enabled
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm py-2">
                {content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface CollapsibleSectionProps {
  sectionTitle: string;
  items: Array<{ title: string; content: string[] }>;
  colorClass?: string;
  bgColorClass?: string;
  disableItemCollapse?: boolean; // New prop for CollapsibleSection
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  sectionTitle,
  items,
  colorClass = "text-gray-800",
  bgColorClass = "bg-gray-50",
  disableItemCollapse = false, // Destructure the new prop with a default value
}) => {
  return (
    <div
      className={`mt-4 p-6 rounded-lg shadow-sm border border-gray-200 ${bgColorClass}`}
    >
      <h3
        className={`font-bold text-2xl capitalize mb-4 ${colorClass} border-b pb-3 border-gray-200`}
      >
        {sectionTitle}
      </h3>
      <div>
        {items.map((item, i) => (
          <CollapsibleItem
            key={i}
            title={item.title}
            content={item.content}
            colorClass={colorClass}
            disableCollapse={disableItemCollapse} // Pass the prop down
          />
        ))}
      </div>
    </div>
  );
};

export default CollapsibleSection;
