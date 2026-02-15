'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Is Yors really free?",
    answer: "Yes! Yors is completely free for Yes/No questions. You can create unlimited questions, vote on others, and see real-time results without paying anything. Premium features like multiple choice questions are optional."
  },
  {
    question: "How do multiple choice questions work?",
    answer: "Premium users can create questions with up to 6 custom options. Each option can have its own color, and voters can choose one option. Results show the percentage for each option in real-time."
  },
  {
    question: "Can I schedule questions for later?",
    answer: "Yes! When creating a question, you can set a start date and end date. Your question will automatically become active on the start date and close on the end date."
  },
  {
    question: "How do I share my questions?",
    answer: "Each question has a share button that lets you copy the link or share directly to social media platforms like Twitter and Facebook. You can also embed questions on your website."
  },
  {
    question: "What's included in Premium?",
    answer: "Premium includes: Multiple choice questions (up to 6 options), custom option colors, advanced analytics, priority support, early access to new features, and a premium badge on your profile."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription anytime from your profile settings. You'll continue to have Premium access until the end of your billing period."
  },
  {
    question: "How accurate are the results?",
    answer: "Results are calculated in real-time with 100% accuracy. Each vote is recorded instantly and the percentage bars update live for everyone to see."
  },
  {
    question: "Can I see who voted on my questions?",
    answer: "For privacy reasons, votes are anonymous by default. However, you can see the total number of votes and the breakdown of responses."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#09637E]/10 text-[#09637E] text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about Yors</p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <div className={`bg-card border rounded-xl overflow-hidden transition-all ${
                  openIndex === index ? 'border-[#09637E]/30 shadow-lg' : 'hover:border-muted-foreground/30'
                }`}>
                  <div className="flex items-center justify-between p-4 md:p-5">
                    <span className="font-medium pr-4">{item.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 md:px-5 pb-4 md:pb-5 text-muted-foreground border-t pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
