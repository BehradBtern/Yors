'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Calendar, Clock, Share2, 
  Twitter, Facebook, Link2, BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { getArticleBySlug, blogArticles } from '@/lib/blog-articles'
import { useSiteConfig } from '@/hooks/useSiteConfig'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { config } = useSiteConfig()
  const article = getArticleBySlug(resolvedParams.slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get the date from config based on whether this is featured
  const date = article.featured 
    ? config.blogDates.featured 
    : config.blogDates.posts[blogArticles.filter(a => !a.featured).findIndex(a => a.slug === article.slug)] || config.lastUpdated

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
  }

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
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {article.featured && (
                  <Badge className="bg-amber-500">Featured</Badge>
                )}
                <Badge variant="outline">{article.category}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white text-sm font-bold">
                    {article.author.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{article.author.name}</div>
                    <div className="text-xs">{article.author.role}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-[#09637E] to-[#088395] rounded-xl flex items-center justify-center mb-8">
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>

            {/* Article Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/^# .+$/gm, (match) => `<h1 class="text-3xl font-bold mt-8 mb-4">${match.slice(2)}</h1>`)
                    .replace(/^## .+$/gm, (match) => `<h2 class="text-2xl font-bold mt-8 mb-4">${match.slice(3)}</h2>`)
                    .replace(/^### .+$/gm, (match) => `<h3 class="text-xl font-semibold mt-6 mb-3">${match.slice(4)}</h3>`)
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
                    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm my-4"><code>$2</code></pre>')
                    .replace(/^- .+$/gm, (match) => `<li class="ml-4">${match.slice(2)}</li>`)
                    .replace(/^(\d+)\. .+$/gm, (match) => `<li class="ml-4 list-decimal">${match.replace(/^\d+\. /, '')}</li>`)
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#09637E] hover:underline">$1</a>')
                    .replace(/^> .+$/gm, (match) => `<blockquote class="border-l-4 border-[#09637E] pl-4 italic text-muted-foreground my-4">${match.slice(2)}</blockquote>`)
                    .replace(/---/g, '<hr class="my-8 border-t" />')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<)/gm, '')
                    .replace(/^/, '<p class="mb-4">')
                    .replace(/$/, '</p>')
                    .replace(/<p class="mb-4"><\/p>/g, '')
                    .replace(/<p class="mb-4"><h/g, '<h')
                    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
                    .replace(/<p class="mb-4"><pre/g, '<pre')
                    .replace(/<\/pre><\/p>/g, '</pre>')
                    .replace(/<p class="mb-4"><blockquote/g, '<blockquote')
                    .replace(/<\/blockquote><\/p>/g, '</blockquote>')
                    .replace(/<p class="mb-4"><li/g, '<ul class="list-disc ml-4 mb-4"><li')
                    .replace(/<\/li><\/p>/g, '</li></ul>')
                    .replace(/<\/li><li/g, '</li><li')
                }}
              />
            </div>

            {/* Share Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share this article
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={copyLink}
                  >
                    <Link2 className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Author Bio */}
            <Card className="mb-8 bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {article.author.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{article.author.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{article.author.role}</p>
                    <p className="text-sm text-muted-foreground">
                      Part of the Yors team, passionate about making decision-making simpler for everyone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">More Articles</h3>
              <div className="grid gap-4">
                {blogArticles
                  .filter(a => a.slug !== article.slug)
                  .slice(0, 3)
                  .map((relatedArticle) => (
                    <Link key={relatedArticle.slug} href={`/blog/${relatedArticle.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-6 w-6 text-[#09637E]/60" />
                            </div>
                            <div>
                              <Badge variant="outline" className="mb-1 text-xs">{relatedArticle.category}</Badge>
                              <h4 className="font-medium line-clamp-1">{relatedArticle.title}</h4>
                              <p className="text-sm text-muted-foreground">{relatedArticle.readTime}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Yors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
