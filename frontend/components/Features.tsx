"use client";

import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiZap } from "react-icons/fi";

const features = [
  {
    icon: FiCheckCircle,
    title: "ATS Score Check",
    description:
      "Get instant ATS compatibility scores and optimize your resume for applicant tracking systems.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FiZap,
    title: "AI Resume Feedback",
    description:
      "Receive intelligent suggestions and improvements powered by advanced AI technology.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: FiFileText,
    title: "Smart Resume Builder",
    description:
      "Create professional resumes with our intuitive, form-based editor in minutes.",
    gradient: "from-pink-500 to-blue-500",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, optimize, and perfect your resume.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                ></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

