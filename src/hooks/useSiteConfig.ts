'use client'

import { useState, useEffect } from 'react'

interface SiteConfig {
  demoMode: boolean
  totalUsers: number
  totalQuestions: number
  totalVotes: number
  totalCountries: number
  dailyActiveUsers: number
  premiumUsers: number
  uptime: number
  lastUpdated: string
  foundedYear: number
  languagesSupported: number
  milestones: Array<{ year: string; event: string }>
  communityMembers: number
  monthlyVotes: number
  topContributors: Array<{ name: string; polls: number; votes: number; badge: string }>
  discussionTopics: Array<{ title: string; count: number; lastActivity: string }>
  services: Array<{ name: string; status: string; uptime: string }>
  uptimeHistory: Array<{ month: string; uptime: string }>
  blogDates: {
    featured: string
    posts: string[]
  }
  pressReleases: Array<{ date: string; title: string }>
  events: Array<{ title: string; date: string; description: string }>
}

// Default demo config for initial render
const defaultConfig: SiteConfig = {
  demoMode: true,
  totalUsers: 50000,
  totalQuestions: 50000,
  totalVotes: 1000000,
  totalCountries: 150,
  dailyActiveUsers: 10000,
  premiumUsers: 2500,
  uptime: 99.95,
  lastUpdated: 'February 14, 2025',
  foundedYear: 2023,
  languagesSupported: 16,
  milestones: [
    { year: '2023', event: 'Yors founded with a mission to simplify decision-making' },
    { year: '2023', event: 'Reached 10,000 users in first 3 months' },
    { year: '2024', event: 'Launched premium features and API' },
    { year: '2024', event: 'Expanded to 16 languages' },
    { year: '2025', event: '1 million votes milestone' },
  ],
  communityMembers: 50000,
  monthlyVotes: 1000000,
  topContributors: [
    { name: 'Sarah K.', polls: 156, votes: 2341, badge: 'Poll Master' },
    { name: 'Mike R.', polls: 89, votes: 1892, badge: 'Top Voter' },
    { name: 'Emma L.', polls: 72, votes: 1654, badge: 'Rising Star' },
    { name: 'David C.', polls: 65, votes: 1432, badge: 'Active Member' },
    { name: 'Lisa M.', polls: 54, votes: 1287, badge: 'Engaged User' },
  ],
  discussionTopics: [
    { title: 'Feature Requests', count: 234, lastActivity: '2 hours ago' },
    { title: 'Poll Ideas & Inspiration', count: 567, lastActivity: '30 minutes ago' },
    { title: 'API & Developers', count: 89, lastActivity: '4 hours ago' },
    { title: 'General Discussion', count: 1023, lastActivity: '5 minutes ago' },
  ],
  services: [
    { name: 'Web Application', status: 'operational', uptime: '99.99%' },
    { name: 'API Services', status: 'operational', uptime: '99.98%' },
    { name: 'Database', status: 'operational', uptime: '99.99%' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%' },
    { name: 'CDN & Assets', status: 'operational', uptime: '99.99%' },
    { name: 'Email Services', status: 'operational', uptime: '99.99%' },
  ],
  uptimeHistory: [
    { month: 'Feb 2025', uptime: '99.95%' },
    { month: 'Jan 2025', uptime: '99.98%' },
    { month: 'Dec 2024', uptime: '99.99%' },
    { month: 'Nov 2024', uptime: '99.97%' },
    { month: 'Oct 2024', uptime: '99.99%' },
    { month: 'Sep 2024', uptime: '99.98%' },
  ],
  blogDates: {
    featured: 'Feb 10, 2025',
    posts: ['Feb 5, 2025', 'Jan 28, 2025', 'Jan 20, 2025', 'Jan 15, 2025', 'Jan 10, 2025']
  },
  pressReleases: [
    { date: 'Feb 1, 2025', title: 'Yors Reaches 1 Million Votes Milestone' },
    { date: 'Jan 15, 2025', title: 'Yors Launches Premium Features and API Access' },
    { date: 'Dec 10, 2024', title: 'Yors Expands to 16 Languages' },
  ],
  events: [
    { title: 'Monthly Community Poll', date: 'Every 1st of the month', description: 'Vote on new features and priorities' },
    { title: 'Community AMA', date: 'Feb 20, 2025', description: 'Ask the founders anything' },
    { title: 'Hackathon', date: 'Mar 15-16, 2025', description: 'Build with Yors API' },
  ],
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return { config, loading }
}

// Helper functions for formatting
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+'
  }
  return num.toString() + '+'
}

export function formatNumberExact(num: number): string {
  return num.toLocaleString()
}
