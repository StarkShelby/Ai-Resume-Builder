"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiMail, FiSend, FiMapPin, FiPhone, FiGithub, FiLinkedin } from "react-icons/fi";
import { toast } from "react-hot-toast";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
                {
                    name: formData.name,
                    from_email: formData.email,
                    title: formData.subject,
                    message: formData.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
            );

            if (result.status === 200) {
                toast.success("Message sent successfully! I'll get back to you soon.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast.error("Failed to send message. Please try again or email me directly.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
            },
        },
    };

    const floatingVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 2 }}
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Have a question or want to work together? I'd love to hear from you!
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-8"
                >
                    {/* Contact Info Cards */}
                    <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
                        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:border-purple-500 transition-all duration-300 group">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <FiMail className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">Email</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Send me an email
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <a
                                    href="mailto:skynight410@gmail.com"
                                    className="text-purple-400 hover:text-purple-300 transition-colors break-all"
                                >
                                    Mail Me
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <FiMapPin className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">Location</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Where I'm based
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">Origin India</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:border-green-500 transition-all duration-300 group">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <FiPhone className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">Social</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Connect with me
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4">
                                    <a
                                        href="https://github.com/StarkShelby"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FiGithub className="text-2xl" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/sharique-rahmani-63b7182a3/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FiLinkedin className="text-2xl" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">Send a Message</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Fill out the form below and I'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            whileFocus={{ scale: 1.02 }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="name" className="text-gray-300">
                                                Your Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 transition-all duration-300"
                                            />
                                        </motion.div>

                                        <motion.div
                                            whileFocus={{ scale: 1.02 }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="email" className="text-gray-300">
                                                Your Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 transition-all duration-300"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="subject" className="text-gray-300">
                                            Subject
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What's this about?"
                                            required
                                            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 transition-all duration-300"
                                        />
                                    </motion.div>

                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="message" className="text-gray-300">
                                            Message
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell me more about your project or inquiry..."
                                            required
                                            rows={6}
                                            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 transition-all duration-300 resize-none"
                                        />
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 text-lg shadow-lg shadow-purple-500/50 transition-all duration-300"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    <FiSend className="mr-2" />
                                                    Send Message
                                                </span>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center space-x-2 text-gray-400">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500"></div>
                        <span className="text-sm">Let's build something amazing together</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-500"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
