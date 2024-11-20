"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Bookmark, 
  TrendingUp, 
  Filter, 
  Search, 
  CheckCircle2,
  X 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/hooks/use-toast';
import { cn } from "@/lib/utils";

// Enhanced Interfaces
interface Author {
  id: string;
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
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  bookmarks: number;
  tags: string[];
  readTime: string;
  trending: boolean;
}

const HealthFeed: React.FC = () => {
  // State Management
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'forYou' | 'trending' | 'latest'>('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categories with extended details
  const categories = [
    { 
      id: 'nutrition', 
      label: 'Nutrition', 
      icon: '🥗', 
      description: 'Healthy eating insights' 
    },
    { 
      id: 'fitness', 
      label: 'Fitness', 
      icon: '💪', 
      description: 'Workout and exercise tips' 
    },
    { 
      id: 'mental-health', 
      label: 'Mental Health', 
      icon: '🧠', 
      description: 'Wellness and mindfulness' 
    },
    { 
      id: 'sleep', 
      label: 'Sleep', 
      icon: '😴', 
      description: 'Better sleep strategies' 
    }
  ];

  // Fetch or initialize posts
  useEffect(() => {
    // Simulated post data
    const initialPosts: Post[] = [
      {
        id: '1',
        author: {
          id: 'author1',
          name: 'Dr. Sarah Johnson',
          avatar: '/logo.ico',
          role: 'Nutritionist',
          verified: true
        },
        content: 'The Mediterranean diet is more than just food - it\'s a lifestyle that promotes longevity and wellness.',
        timestamp: '2 hours ago',
        likes: 245,
        comments: [],
        shares: 18,
        bookmarks: 12,
        tags: ['Diet', 'Wellness', 'Nutrition'],
        readTime: '3 min read',
        trending: true
      }
    ];

    setPosts(initialPosts);
    setIsLoading(false);
  }, []);

  // Interaction Handlers
  const handleLike = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
    toast({
      title: "Post Liked",
      description: "You've shown appreciation for this post!",
      variant: "default"
    });
  }, []);

  const handleComment = useCallback((postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: Date.now().toString(),
            author: {
              id: 'current-user',
              name: 'You',
              avatar: '/default-avatar.png',
              role: 'User',
              verified: false
            },
            content: commentText,
            timestamp: 'Just now',
            likes: 0
          };

          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully!",
      className: "bg-teal-50 border-teal-500"
    });
  }, []);

  const handleBookmark = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, bookmarks: post.bookmarks + 1 } 
          : post
      )
    );
    
    toast({
      title: "Bookmarked",
      description: "Post saved to your collection.",
      // icon: <Bookmark className="text-teal-500" />
    });
  }, []);

  // Filtering Logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = filters.length === 0 || 
      post.tags.some(tag => filters.includes(tag.toLowerCase()));
    return matchesSearch && matchesFilters;
  });

  // Post Card Component
  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-teal-500">
        {/* Post Header */}
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="ring-2 ring-teal-500">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{post.author.name}</h3>
              {post.author.verified && (
                <CheckCircle2 className="text-teal-500 w-4 h-4" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {post.timestamp} • {post.readTime}
            </p>
          </div>
        </CardHeader>

        {/* Post Content */}
        <CardContent>
          <p className="text-gray-700 mb-4">{post.content}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-teal-50 text-teal-700 hover:bg-teal-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Post Interactions */}
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleLike(post.id)}
              className="hover:bg-teal-50 group"
            >
              <Heart 
                className={cn(
                  "w-5 h-5 text-gray-500 group-hover:text-red-500", 
                  "transition-colors"
                )} 
              />
              <span className="ml-2">{post.likes}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowComments(!showComments)}
              className="hover:bg-teal-50"
            >
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="ml-2">{post.comments.length}</span>
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="ml-2">{post.shares}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Post</DialogTitle>
              </DialogHeader>
              {/* Share options */}
            </DialogContent>
          </Dialog>
        </CardFooter>

        {/* Comments Section */}
        {showComments && (
          <div className="p-4 bg-gray-50">
            {post.comments.map(comment => (
              <div key={comment.id} className="mb-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">{comment.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            <div className="flex space-x-2 mt-4">
              <Input 
                placeholder="Write a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow"
              />
              <Button 
                size="sm" 
                variant="outline"
                className="bg-teal-500 text-white hover:bg-teal-600"
                onClick={() => {
                  handleComment(post.id, newComment);
                  setNewComment('');
                }}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
          <Input 
            placeholder="Search wellness posts..." 
            className="pl-10 border-teal-300 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <Filter className="mr-2 text-teal-500" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map(category => (
              <DropdownMenuItem 
                key={category.id}
                onSelect={() => {
                  setFilters(prev => 
                    prev.includes(category.id) 
                      ? prev.filter(f => f !== category.id)
                      : [...prev, category.id]
                  );
                }}
                className={cn(
                  "cursor-pointer hover:bg-teal-50",
                  filters.includes(category.id) && "bg-teal-100"
                )}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Tabs */}
      <Tabs 
        value={selectedTab} 
        onValueChange={(value: any) => setSelectedTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="forYou" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex items-center gap-2"
          >
            <TrendingUp size={16} />
            Trending
          </TabsTrigger>
          <TabsTrigger 
            value="latest" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            Latest
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-48 w-full" />
            ))
          ) : (
            <>
              <TabsContent value="forYou">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              <TabsContent value="trending">
                {filteredPosts.filter(p => p.trending).map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              <TabsContent value="latest">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default HealthFeed;