'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, Calendar, Zap, Settings, Clock, Crown, X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CreateQuestionDialogProps {
  onSubmit: (data: {
    text: string
    questionType: 'yesNo' | 'multiple'
    yesLabel: string
    noLabel: string
    options?: { text: string; color: string }[]
    status: 'active' | 'scheduled' | 'draft'
    startDate?: string
    endDate?: string
  }) => Promise<void>
  submitting: boolean
  isPremium?: boolean
}

const DEFAULT_COLORS = ['#09637E', '#088395', '#7AB2B2', '#f59e0b', '#10b981', '#8b5cf6']

export function CreateQuestionDialog({ onSubmit, submitting, isPremium = false }: CreateQuestionDialogProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'quick' | 'scheduled'>('quick')
  const [questionType, setQuestionType] = useState<'yesNo' | 'multiple'>('yesNo')
  const [formData, setFormData] = useState({
    text: '',
    yesLabel: 'Yes',
    noLabel: 'No',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  })
  const [options, setOptions] = useState([
    { text: '', color: DEFAULT_COLORS[0] },
    { text: '', color: DEFAULT_COLORS[1] }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.text.trim()) return

    // Validate multiple choice options
    if (questionType === 'multiple') {
      const validOptions = options.filter(o => o.text.trim())
      if (validOptions.length < 2) {
        return
      }
    }
    
    let startDate: string | undefined
    let endDate: string | undefined
    
    if (mode === 'scheduled') {
      if (formData.startDate && formData.startTime) {
        startDate = new Date(`${formData.startDate}T${formData.startTime}`).toISOString()
      }
      if (formData.endDate && formData.endTime) {
        endDate = new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
      }
    }

    await onSubmit({
      text: formData.text,
      questionType,
      yesLabel: formData.yesLabel,
      noLabel: formData.noLabel,
      options: questionType === 'multiple' 
        ? options.filter(o => o.text.trim()).map((o, i) => ({ text: o.text, color: DEFAULT_COLORS[i % 6] }))
        : undefined,
      status: mode === 'scheduled' ? 'scheduled' : 'active',
      startDate,
      endDate
    })

    // Reset form
    setFormData({
      text: '',
      yesLabel: 'Yes',
      noLabel: 'No',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: ''
    })
    setOptions([
      { text: '', color: DEFAULT_COLORS[0] },
      { text: '', color: DEFAULT_COLORS[1] }
    ])
    setQuestionType('yesNo')
    setOpen(false)
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', color: DEFAULT_COLORS[options.length % 6] }])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], text }
    setOptions(newOptions)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="gap-2 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#09637E] shadow-lg shadow-[#09637E]/20"
          >
            <PlusCircle className="h-4 w-4" />
            Create Question
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-[#7AB2B2]/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#09637E]">Create New Question</DialogTitle>
        </DialogHeader>
        
        {/* Question Type Toggle */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <button
            type="button"
            onClick={() => setQuestionType('yesNo')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              questionType === 'yesNo' 
                ? 'bg-[#09637E] text-white' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            Yes / No
          </button>
          <button
            type="button"
            onClick={() => setQuestionType('multiple')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              questionType === 'multiple' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Crown className="h-3 w-3" />
            Multiple Choice
            {!isPremium && <span className="text-xs opacity-75">(Premium)</span>}
          </button>
        </div>

        {/* Premium notice for multiple choice */}
        {questionType === 'multiple' && !isPremium && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-sm">
            <div className="flex items-center gap-2 text-amber-600 font-medium mb-1">
              <Crown className="h-4 w-4" />
              Premium Feature
            </div>
            <p className="text-muted-foreground">
              Multiple choice questions are available for premium users. Upgrade to unlock this feature!
            </p>
          </div>
        )}

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'scheduled')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="quick" className="gap-2">
              <Zap className="h-4 w-4" />
              Quick Publish
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-[#09637E] font-medium">Question</Label>
              <Input
                id="text"
                placeholder="Should pizza have pineapple?"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="border-[#7AB2B2]/50 focus:border-[#09637E]"
                required
              />
            </div>

            {/* Yes/No Labels */}
            {questionType === 'yesNo' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="yesLabel" className="text-green-600 font-medium flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Yes Label
                  </Label>
                  <Input
                    id="yesLabel"
                    placeholder="Yes"
                    value={formData.yesLabel}
                    onChange={(e) => setFormData({ ...formData, yesLabel: e.target.value })}
                    className="border-green-500/50 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noLabel" className="text-red-600 font-medium flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    No Label
                  </Label>
                  <Input
                    id="noLabel"
                    placeholder="No"
                    value={formData.noLabel}
                    onChange={(e) => setFormData({ ...formData, noLabel: e.target.value })}
                    className="border-red-500/50 focus:border-red-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Multiple Choice Options */}
            {questionType === 'multiple' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[#09637E] font-medium">Options</Label>
                  <span className="text-xs text-muted-foreground">{options.length}/6 options</span>
                </div>
                
                <AnimatePresence>
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: DEFAULT_COLORS[index % 6] }}
                      />
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1"
                        required
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full gap-2 border-dashed"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                )}
              </div>
            )}

            {/* Schedule Options */}
            <TabsContent value="scheduled" className="space-y-4 mt-0">
              <div className="p-4 rounded-lg bg-[#09637E]/5 border border-[#7AB2B2]/30">
                <div className="flex items-center gap-2 mb-3 text-[#09637E]">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-sm">Voting Period</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input
                      type="date"
                      min={getMinDate()}
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input
                      type="date"
                      min={formData.startDate || getMinDate()}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="submit"
                  disabled={submitting || !formData.text.trim() || (questionType === 'multiple' && !isPremium)}
                  className={`w-full ${
                    questionType === 'multiple' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                      : 'bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#09637E]'
                  }`}
                >
                  {submitting ? (
                    'Creating...'
                  ) : mode === 'quick' ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Publish Now
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
