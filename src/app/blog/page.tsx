'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Calendar, Clock,
  BookOpen, Rocket
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/hooks/useSiteConfig'
import { blogArticles } from '@/lib/blog-articles'

const categories = ['All', 'Product', 'Insights', 'Guides', 'Announcements', 'Community']

export default function BlogPage() {
  const { config } = useSiteConfig()

  // Combine blog posts with dynamic dates
  const blogPostsWithDates = blogArticles.map((post, index) => ({
    ...post,
    date: post.featured 
      ? config.blogDates.featured 
      : config.blogDates.posts[blogArticles.filter(a => !a.featured).findIndex(a => a.slug === post.slug)] || config.lastUpdated,
  }))

  const featuredPost = blogPostsWithDates.find(p => p.featured)
  const regularPosts = blogPostsWithDates.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Yors</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Yors <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, updates, and stories from the world of simple decision-making.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={category === 'All' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-[#09637E]/10"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="overflow-hidden bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5 border-[#09637E]/20 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="aspect-video bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/80" />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-amber-500">Featured</Badge>
                          <Badge variant="outline">{featuredPost.category}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
                        <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {featuredPost.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {featuredPost.readTime}
                          </span>
                        </div>
                        <Button className="w-fit mt-4 bg-gradient-to-r from-[#09637E] to-[#088395]">
                          Read Article
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-[#09637E]/60" />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline" className="mb-3">{post.category}</Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
            <CardContent className="p-8">
              <Rocket className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-6">
                Get the latest posts and updates delivered directly to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-foreground"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Yors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
