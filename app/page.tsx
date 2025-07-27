"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle, Mic, FileText, MessageSquare, BookOpen, ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useModal } from "@/contexts/modal-context"

export default function LandingPage() {
  const router = useRouter()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { openModal } = useModal()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const features = [
    {
      icon: <Mic className="h-10 w-10 text-primary" />,
      title: "Voice-Guided Learning",
      description: "Practice your English pronunciation with real-time feedback and corrections.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "PDF Summarization",
      description: "Upload any PDF and get concise summaries with key points highlighted.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Interview Preparation",
      description: "Practice for interviews with our AI assistant providing feedback on your responses.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Grammar Correction",
      description: "Get instant grammar corrections and suggestions to improve your English.",
    },
  ]

  const testimonials = [
    {
      name: "Rohit",
      role: "AI&DS Student",
      image: "/assets/images/rohit-profile.jpg",
      content:
        "EduMate has transformed my English learning journey. The voice assistant helps me correct my pronunciation instantly!",
    },
    {
      name: "Ravi Kumar",
      role: "AI&DS Student",
      image: "/assets/images/ravi-profile.jpg",
      content: "I practiced for my job interviews with EduMate and it helped me gain confidence. I got the job!",
    },
    {
      name: "Deepak",
      role: "AI&DS Student",
      image: "/assets/images/deepak-profile.jpg",
      content: "The PDF summarization feature saves me hours of reading. I can quickly understand complex documents.",
    },
  ]

  const faqs = [
    {
      question: "How does the voice assistant work?",
      answer:
        "Our 3D AI instructor uses advanced speech recognition to analyze your pronunciation and grammar. It provides real-time feedback and suggestions to help you improve your English speaking skills.",
    },
    {
      question: "Can I upload any type of PDF?",
      answer:
        "Yes, you can upload any PDF document. Our AI will analyze the content, summarize it, and extract key points. The instructor will then teach you the content in an interactive way.",
    },
    {
      question: "How accurate is the grammar correction?",
      answer:
        "Our grammar correction system is built on advanced AI models with over 95% accuracy. It can detect and correct a wide range of grammatical errors, from basic to complex.",
    },
    {
      question: "Can EduMate help with interview preparation?",
      answer:
        "EduMate can simulate interview scenarios, ask common interview questions, and provide feedback on your responses. It helps you improve your communication skills and confidence.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security very seriously. All your uploads and interactions are encrypted and stored securely. We do not share your data with third parties.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary">EduMate</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Button onClick={() => router.push("/signup")}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-gradient-to-b from-background to-muted"
        style={{ opacity, scale }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Master English with Your 3D AI Instructor
              </motion.h1>
              <motion.p
                className="mt-6 text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Improve your English speaking, prepare for interviews, and learn from any document with our interactive
                3D AI assistant.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" onClick={() => router.push("/signup")}>
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <motion.div
                className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Image
                  src="/assets/images/Landing Page Image.png"
                  alt="EduMate 3D AI Instructor teaching a student"
                  fill
                  priority
                  className="object-contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Powerful Features for English Mastery</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              EduMate combines cutting-edge AI with interactive learning to help you master English effortlessly.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl border bg-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">How EduMate Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our 3D AI instructor makes learning English intuitive and effective.
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-primary/20 hidden md:block"></div>

            {[
              {
                title: "Upload Your Content",
                description: "Upload PDFs, documents, or practice materials you want to learn from.",
                image: "/assets/images/Upload Your Content.png",
                align: "left",
              },
              {
                title: "AI Analysis",
                description: "Our AI analyzes the content, extracts key points, and prepares personalized lessons.",
                image: "/assets/images/AI Analysis.png",
                align: "right",
              },
              {
                title: "Interactive Learning",
                description: "Engage with our 3D AI instructor through voice conversations to practice and learn.",
                image: "/assets/images/Interactive Learning.png",
                align: "left",
              },
              {
                title: "Track Progress",
                description: "Monitor your improvement over time with detailed analytics and progress reports.",
                image: "/assets/images/Tracking Progress.png",
                align: "right",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center mb-16 ${
                  step.align === "right" ? "md:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/2 p-6">
                  <div className="relative h-[400px] w-full max-w-[600px] mx-auto rounded-xl overflow-hidden shadow-lg bg-[#f2e6ff]">
                    {step.title === "Interactive Learning" || step.title === "Track Progress" ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    ) : (
                      <Image 
                        src={step.image} 
                        alt={step.title} 
                        fill 
                        className="object-contain"
                        style={{ width: '100%', height: '100%' }}
                      />
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 p-6">
                  <div className={`flex ${step.align === "right" ? "justify-end" : "justify-start"} md:px-12`}>
                    <div className="max-w-md">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold ml-4">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of satisfied learners who have improved their English with EduMate.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border bg-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic">&ldquo;{testimonial.content}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about EduMate.</p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6 p-6 rounded-xl border bg-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Ready to Improve Your English?</h2>
            <p className="mt-4 text-xl opacity-90">
              Join thousands of learners and start your journey to English fluency today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => router.push("/signup")}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">EduMate</h3>
              <p className="text-muted-foreground">
                Your AI-powered English learning companion for mastering the language with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => openModal("about")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("blog")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("careers")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("contact")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => openModal("privacy")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("terms")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("cookie")}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EduMate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="https://www.linkedin.com/in/tech-ravinthiran/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </Link>
              <Link href="https://github.com/techravinthiran" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

