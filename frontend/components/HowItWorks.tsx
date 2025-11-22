"use client";

import { motion } from "framer-motion";
import { FiUpload, FiZap, FiDownload } from "react-icons/fi";

const steps = [
  {
    number: "01",
    icon: FiUpload,
    title: "Upload or Create",
    description:
      "Start by uploading your existing resume or create a new one from scratch using our intuitive builder.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    number: "02",
    icon: FiZap,
    title: "Let AI Optimize",
    description:
      "Our AI analyzes your resume, checks ATS compatibility, and provides personalized feedback and suggestions.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    number: "03",
    icon: FiDownload,
    title: "Download Resume",
    description:
      "Export your optimized resume as a beautifully formatted PDF, ready to send to employers.",
    gradient: "from-pink-500 to-blue-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-20 h-20 rounded-xl bg-gradient-to-r ${step.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-400 mb-2">
                        STEP {step.number}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

