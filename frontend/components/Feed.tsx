"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle, Bookmark, Send, TrendingUp, Filter, Bell, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { TabsList } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";

// Interfaces
interface Author {
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: number;
  author: Author;
  timeAgo: string;
  category: string;
  content: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
  isBookmarked: boolean;
  image?: string;
  showComments: boolean;
  trending: boolean;
  readTime: string;
  topics: string[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface Quote {
  text: string;
  author: string;
  category: string;
}

interface TabContentProps {
  posts: Post[];
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
  onShare: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
  onShare: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

// Component implementation
const HealthFeed: React.FC = () => {
  // State with proper typing
  const [selectedTab, setSelectedTab] = useState<'forYou' | 'trending' | 'latest'>('forYou');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  // Extended categories with descriptions
  const categories: Category[] = [
    { 
      id: 'nutrition', 
      label: 'Nutrition', 
      icon: '🥗',
      description: 'Healthy eating tips and diet advice'
    },
    { 
      id: 'fitness', 
      label: 'Fitness', 
      icon: '💪',
      description: 'Workout routines and exercise guides'
    },
    { 
      id: 'mental', 
      label: 'Mental Health', 
      icon: '🧠',
      description: 'Mindfulness and emotional wellness'
    },
    { 
      id: 'sleep', 
      label: 'Sleep', 
      icon: '😴',
      description: 'Better sleep habits and tips'
    }
  ];

  // Sample posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "/logo.ico",
        role: "Nutritionist",
        verified: true
      },
      timeAgo: "2 hours ago",
      category: "nutrition",
      content: "🥗 Understanding the Mediterranean Diet: This eating pattern isn't just a diet—it's a lifestyle that emphasizes whole foods, healthy fats, and mindful eating. Studies show it can reduce the risk of heart disease by up to 30%.",
      likes: 245,
      isLiked: false,
      comments: [],
      shares: 18,
      isBookmarked: false,
      image: "/",
      showComments: false,
      trending: true,
      readTime: "3 min read",
      topics: ["Diet", "Heart Health", "Lifestyle"]
    },
    // Add more posts as needed
  ]);

  // Effects
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleLike = (postId: number): void => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
        return {
          ...post,
          likes: newLikes,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number, comment: string): void => {
    if (!comment.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          author: {
            name: "Current User",
            avatar: "/api/placeholder/32/32",
            role: "Member",
            verified: false
          },
          content: comment,
          timestamp: "Just now",
          likes: 0
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
    setNewComment('');
  };

  const handleShare = (postId: number): void => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        };
      }
      return post;
    }));
    // Show share success notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBookmark = (postId: number): void => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = filters.length === 0 || filters.includes(post.category);
    return matchesSearch && matchesFilters;
  });

  // Post Card Component
  const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare, onBookmark }) => {
    const [isCommenting, setIsCommenting] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');

    return (
      <Card className={cn(
        "group overflow-hidden transition-all duration-500 border-t-4",
        "hover:shadow-xl hover:border-t-teal-500",
        "md:hover:scale-[1.02]"
      )}>
        <CardHeader className="space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="ring-2 ring-teal-500 ring-offset-2 transition-all group-hover:ring-4">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  {post.author.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.timeAgo}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open menu</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBookmark(post.id)}>
                  {post.isBookmarked ? 'Remove Bookmark' : 'Save Post'}
                </DropdownMenuItem>
                <DropdownMenuItem>Hide Post</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">{post.content}</p>
            
            {post.topics && (
              <div className="flex flex-wrap gap-2">
                {post.topics.map(topic => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="hover:bg-teal-50 cursor-pointer transition-colors"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
            
            {post.image && (
              <img 
                src={post.image} 
                alt="Post content" 
                className="rounded-lg w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t bg-gray-50">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    post.isLiked && "text-red-500"
                  )}
                  onClick={() => onLike(post.id)}
                >
                  <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
                  <span>{post.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsCommenting(!isCommenting)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => onShare(post.id)}
                >
                  <Share2 className="w-5 h-5" />
                  <span>{post.shares}</span>
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "transition-colors",
                  post.isBookmarked && "text-teal-600"
                )}
                onClick={() => onBookmark(post.id)}
              >
                <Bookmark className={cn("w-5 h-5", post.isBookmarked && "fill-current")} />
              </Button>
            </div>

            {isCommenting && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e : any) => setComment(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  size="sm"
                  onClick={() => {
                    onComment(post.id, comment);
                    setComment('');
                    setIsCommenting(false);
                  }}
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BackgroundBeams className="fixed inset-0 opacity-20" />
      
      {/* Header Section */}
      <header className="relative">
        <div className="absolute inset-0">
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1}
            particleDensity={300}
            className="w-full h-full"
            particleColor="#0D9488"
          />
        </div>
        
        <div className="relative text-center py-12 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <TextGenerateEffect words="Health & Wellness Feed" />
          </h1>
          <p className="text-xl text-teal-600 mb-8">Discover insights for a healthier you</p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search posts..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e : any) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={20} />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => {
                      if (filters.includes(category.id)) {
                        setFilters(filters.filter(f => f !== category.id));
                      } else {
                        setFilters([...filters, category.id]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                      {filters.includes(category.id) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Notifications */}
        {showNotification && (
          <Alert className="mb-4 bg-teal-50 border-teal-500">
            <AlertDescription>
              Post shared successfully! Thank you for spreading wellness.
            </AlertDescription>
          </Alert>
        )}

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={(value: 'forYou' | 'trending' | 'latest' | any) => setSelectedTab(value)}>
          <TabsList className="mb-8">
            <TabsTrigger value="forYou" className="flex items-center gap-2">
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp size={16} />
              Trending
            </TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>

          <TabsContent value="forYou">
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="space-y-6">
              {filteredPosts
                .filter(post => post.trending)
                .map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="latest">
            <div className="space-y-6">
              {filteredPosts
                .sort((a, b) => new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime())
                .map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p>Stay healthy, stay informed. Share your wellness journey with others.</p>
        </div>
      </footer>
    </div>
  );
};

export default HealthFeed;