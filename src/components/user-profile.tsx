'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, Mail, Lock, Crown, Calendar, BarChart3, Trash2, 
  Download, Shield, Bell, Palette, Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

interface UserProfileProps {
  user: {
    id: string
    email: string
    name: string
    isPremium?: boolean
    role?: string
    premiumSince?: string | null
    createdAt?: string
  }
  stats: {
    questionsCount: number
    votesCount: number
    totalVotesReceived: number
  }
  onUpdate: (updates: { name?: string; email?: string }) => void
  onLogout: () => void
}

export function UserProfile({ user, stats, onUpdate, onLogout }: UserProfileProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      // In production, this would call an API to update the user
      onUpdate({ name, email })
      setEditing(false)
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/user/export?userId=${user.id}`)
      const data = await response.json()
      
      // Create downloadable JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `yors-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Data Exported',
        description: 'Your data has been downloaded'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user.role === 'owner' && (
                  <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Owner
                  </span>
                )}
                {user.isPremium && user.role !== 'owner' && (
                  <span className="text-xs bg-purple-500/20 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
                {user.isPremium && (
                  <span className="text-xs text-muted-foreground">
                    Since {formatDate(user.premiumSince)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-[#09637E]" />
            <p className="text-2xl font-bold">{stats.questionsCount}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.votesCount}</p>
            <p className="text-xs text-muted-foreground">Votes Cast</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{stats.totalVotesReceived}</p>
            <p className="text-xs text-muted-foreground">Votes Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={loading} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)} className="w-full">
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Bell className="h-4 w-4" />
            Notification Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Globe className="h-4 w-4" />
            Language & Region
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Palette className="h-4 w-4" />
            Appearance
          </Button>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleExportData} className="w-full justify-start gap-3">
            <Download className="h-4 w-4" />
            Export My Data
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Member Since */}
      <div className="text-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 inline mr-1" />
        Member since {formatDate(user.createdAt)}
      </div>
    </div>
  )
}
