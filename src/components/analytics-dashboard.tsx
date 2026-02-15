'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, TrendingDown, Users, Eye, ThumbsUp, ThumbsDown, 
  BarChart3, PieChart, Clock, Globe, Share2, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsDashboardProps {
  data: {
    totalVotes: number
    totalViews: number
    totalQuestions: number
    engagementRate: number
    votesTrend: number
    viewsTrend: number
    topQuestion: {
      text: string
      votes: number
    } | null
    demographicData: {
      age: { label: string; value: number }[]
      location: { label: string; value: number }[]
    }
    timeData: { hour: number; votes: number }[]
  }
  onExport: () => void
  t: Record<string, unknown>
}

export function AnalyticsDashboard({ data, onExport, t }: AnalyticsDashboardProps) {
  const stats = [
    {
      label: 'Total Votes',
      value: data.totalVotes,
      icon: ThumbsUp,
      trend: data.votesTrend,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Views',
      value: data.totalViews,
      icon: Eye,
      trend: data.viewsTrend,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Engagement Rate',
      value: `${data.engagementRate}%`,
      icon: TrendingUp,
      trend: 5.2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Questions Created',
      value: data.totalQuestions,
      icon: BarChart3,
      trend: 0,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ]

  const maxHourlyVotes = Math.max(...data.timeData.map(d => d.votes), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track your poll performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.trend !== 0 && (
                    <div className={`flex items-center text-xs ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(stat.trend)}%
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hourly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {data.timeData.map((d, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#09637E] to-[#088395] rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.votes / maxHourlyVotes) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  title={`${d.hour}:00 - ${d.votes} votes`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>12AM</span>
              <span>6AM</span>
              <span>12PM</span>
              <span>6PM</span>
              <span>11PM</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Question */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Performing Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topQuestion ? (
              <div className="space-y-3">
                <p className="font-medium text-sm line-clamp-2">{data.topQuestion.text}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{data.topQuestion.votes} votes</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{Math.floor(data.topQuestion.votes * 2.5)} views</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#09637E] to-[#088395]"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No questions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.demographicData.age.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#09637E] to-[#088395]"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.demographicData.location.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Share Your Insights</h3>
              <p className="text-sm text-muted-foreground">Export your analytics or share with your team</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
