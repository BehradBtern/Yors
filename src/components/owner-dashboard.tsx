'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, BarChart3, Vote, MessageCircle, Crown, TrendingUp, 
  DollarSign, Activity, Clock, Shield, Star, ArrowUpRight,
  RefreshCw, Eye, UserPlus, FileQuestion, Calendar, ToggleLeft, ToggleRight,
  CreditCard, TestTube
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

interface OwnerStats {
  totalUsers: number
  totalQuestions: number
  totalVotes: number
  totalComments: number
  premiumUsers: number
  activeQuestions: number
  scheduledQuestions: number
  draftQuestions: number
  votesLast7Days: number
  monthlyRevenue: string
}

interface ChartData {
  votesPerDay: { date: string; votes: number }[]
  questionsByCategory: { category: string; count: number }[]
}

interface RecentData {
  users: Array<{
    id: string
    name: string
    email: string
    createdAt: string
    isPremium: boolean
    role: string
  }>
  questions: Array<{
    id: string
    text: string
    createdAt: string
    author: { name: string; email: string }
  }>
  votes: Array<{
    id: string
    createdAt: string
    voter: { name: string }
    question: { text: string }
  }>
}

interface OwnerDashboardProps {
  userId: string
  onBack: () => void
}

export function OwnerDashboard({ userId, onBack }: OwnerDashboardProps) {
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)
  const [recent, setRecent] = useState<RecentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [roleEmail, setRoleEmail] = useState('')
  const [roleType, setRoleType] = useState('premium')
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(true)
  const [togglingDemo, setTogglingDemo] = useState(false)
  const { toast } = useToast()

  // Fetch payment mode
  const fetchPaymentMode = async () => {
    try {
      const response = await fetch('/api/payment-mode')
      const data = await response.json()
      setDemoMode(data.demoMode)
    } catch {
      setDemoMode(true)
    }
  }

  // Toggle demo mode
  const toggleDemoMode = async () => {
    setTogglingDemo(true)
    try {
      const newMode = !demoMode
      const response = await fetch('/api/payment-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, demoMode: newMode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle mode')
      }

      setDemoMode(newMode)
      toast({
        title: newMode ? '🧪 Demo Mode Enabled' : '💳 Production Mode Enabled',
        description: newMode 
          ? 'Users can upgrade instantly without payment'
          : 'Real Stripe payments required for upgrades',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to toggle mode',
        variant: 'destructive'
      })
    } finally {
      setTogglingDemo(false)
    }
  }

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      console.log('Fetching owner stats for userId:', userId)
      const response = await fetch(`/api/owner/stats?userId=${userId}`)
      const data = await response.json()
      console.log('Owner stats response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats')
      }

      setStats(data.stats)
      setCharts(data.charts)
      setRecent(data.recent)
    } catch (error) {
      console.error('Failed to fetch owner stats:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch stats'
      setError(errorMsg)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchStats()
      fetchPaymentMode()
    }
  }, [userId])

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/owner/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          targetEmail: roleEmail,
          role: roleType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role')
      }

      toast({
        title: 'Role Updated!',
        description: `${data.user.email} is now ${roleType}`
      })
      setRoleEmail('')
      fetchStats(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update role',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="relative inline-block">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#09637E] to-[#088395]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Access Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              User ID: {userId || 'Not available'}
            </p>
            <p className="text-sm text-muted-foreground">
              This usually happens after a database reset. Please log out and log back in.
            </p>
            <div className="flex gap-2">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.reload()
                }} 
                className="flex-1"
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Questions', value: stats?.totalQuestions || 0, icon: FileQuestion, color: 'from-[#09637E] to-[#088395]' },
    { label: 'Total Votes', value: stats?.totalVotes || 0, icon: Vote, color: 'from-green-500 to-green-600' },
    { label: 'Comments', value: stats?.totalComments || 0, icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
    { label: 'Premium Users', value: stats?.premiumUsers || 0, icon: Star, color: 'from-amber-500 to-amber-600' },
    { label: 'Active Questions', value: stats?.activeQuestions || 0, icon: Activity, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Scheduled', value: stats?.scheduledQuestions || 0, icon: Calendar, color: 'from-orange-500 to-orange-600' },
    { label: 'Draft Questions', value: stats?.draftQuestions || 0, icon: Clock, color: 'from-gray-500 to-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Owner Dashboard</h1>
              <p className="text-muted-foreground text-sm">Full website overview</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Demo/Production Mode Toggle */}
            <motion.button
              onClick={toggleDemoMode}
              disabled={togglingDemo}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                demoMode 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 border border-purple-500/30' 
                  : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border border-green-500/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {togglingDemo ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : demoMode ? (
                <TestTube className="h-4 w-4" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{demoMode ? 'Demo Mode' : 'Production Mode'}</span>
              {demoMode ? (
                <ToggleRight className="h-5 w-5" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
            </motion.button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <Eye className="h-4 w-4" />
              Back to App
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Payment Mode Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg flex items-center justify-between ${
            demoMode 
              ? 'bg-purple-500/10 border border-purple-500/20' 
              : 'bg-green-500/10 border border-green-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {demoMode ? (
              <>
                <TestTube className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="font-medium text-purple-600">Demo Mode Active</span>
                  <p className="text-xs text-muted-foreground">Users can upgrade instantly without payment</p>
                </div>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 text-green-500" />
                <div>
                  <span className="font-medium text-green-600">Production Mode Active</span>
                  <p className="text-xs text-muted-foreground">Real Stripe payments required for upgrades</p>
                </div>
              </>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDemoMode}
            disabled={togglingDemo}
          >
            Switch to {demoMode ? 'Production' : 'Demo'}
          </Button>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Monthly Revenue</p>
                    <p className="text-3xl font-bold text-amber-600">${stats?.monthlyRevenue || '0.00'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {stats?.premiumUsers || 0} premium users @ $9.99/month
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground">Votes Last 7 Days</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.votesLast7Days || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Votes Per Day Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Votes Last 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {charts?.votesPerDay.map((day, index) => {
                    const maxVotes = Math.max(...(charts?.votesPerDay.map(d => d.votes) || [1]), 1)
                    const height = (day.votes / maxVotes) * 100
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full bg-gradient-to-t from-[#09637E] to-[#088395] rounded-t transition-all hover:from-[#088395] hover:to-[#7AB2B2]"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                        </span>
                        <span className="text-xs font-medium">{day.votes}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Questions by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Questions by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {charts?.questionsByCategory.map((cat) => {
                    const total = charts.questionsByCategory.reduce((sum, c) => sum + c.count, 0) || 1
                    const percentage = (cat.count / total) * 100
                    return (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{cat.category}</span>
                          <span className="text-muted-foreground">{cat.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#09637E] to-[#088395]"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & Role Management */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recent?.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {user.role === 'owner' && (
                          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">Owner</span>
                        )}
                        {user.isPremium && user.role !== 'owner' && (
                          <span className="text-xs bg-purple-500/20 text-purple-600 px-2 py-0.5 rounded-full">Premium</span>
                        )}
                        {user.role === 'user' && !user.isPremium && (
                          <span className="text-xs bg-gray-500/20 text-gray-600 px-2 py-0.5 rounded-full">User</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!recent?.users || recent.users.length === 0) && (
                    <p className="text-center text-muted-foreground text-sm py-4">No users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-green-500" />
                  Recent Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recent?.questions.map((question) => (
                    <div key={question.id} className="p-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium line-clamp-2">{question.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {question.author.name}
                      </p>
                    </div>
                  ))}
                  {(!recent?.questions || recent.questions.length === 0) && (
                    <p className="text-center text-muted-foreground text-sm py-4">No questions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Role Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Role Management
                </CardTitle>
                <CardDescription>Assign roles to users by email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRoleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">User Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={roleEmail}
                      onChange={(e) => setRoleEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                      className="w-full p-2 rounded-md border bg-background"
                    >
                      <option value="user">User</option>
                      <option value="premium">Premium</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-[#09637E] to-[#088395]">
                    Update Role
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Votes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">User</th>
                      <th className="text-left py-2 px-3 font-medium">Question</th>
                      <th className="text-left py-2 px-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent?.votes.map((vote) => (
                      <tr key={vote.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">{vote.voter.name}</td>
                        <td className="py-2 px-3 max-w-xs truncate">{vote.question.text}</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {new Date(vote.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!recent?.votes || recent.votes.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
