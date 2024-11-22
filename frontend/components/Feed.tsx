"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Filter, 
  Search, 
  CheckCircle2,
  TrendingUp,
  Send,
  BadgePlusIcon,
  ChevronDown,
  ChevronUp
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/hooks/use-toast';
import { cn } from "@/lib/utils";
import Image from 'next/image';

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
  liked: boolean;
  comments: Comment[];
  shares: number;
  tags: string[];
  readTime: string;
  trending: boolean;
  image?: string;
}

const categories = [
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌱' }
];

const PostCard: React.FC<{ post: Post; onLike: (id: string) => void; onComment: (id: string, text: string) => void }> = React.memo(({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await onComment(post.id, newComment);
      setNewComment('');
      toast({
        title: "Comment posted",
        description: "Your thoughts have been shared!",
        className: "bg-teal-50 border-teal-500"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setIsCommentsOpen(!isCommentsOpen);
  };

  return (
    <Card className="mb-6 group hover:shadow-lg transition-all duration-300 border-l-4 border-teal-500 bg-teal-50">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="ring-2 ring-teal-500 transition-all duration-300 group-hover:ring-teal-600">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback className="bg-teal-100">{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-teal-900">{post.author.name}</h3>
            {post.author.verified && (
              <CheckCircle2 className="text-teal-500 w-4 h-4" />
            )}
            <span className="text-sm text-teal-600 font-medium">{post.author.role}</span>
          </div>
          <p className="text-sm text-gray-500">{post.timestamp} • {post.readTime}</p>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
        {post.image && (
          <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden mx-auto">
            <Image 
              src={post.image}
              alt="Post image"
              width={192}
              height={192}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors duration-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike(post.id)}
            className={cn(
              "hover:bg-teal-50 transition-colors duration-200",
              post.liked && "text-red-500"
            )}
          >
            <Heart 
              className={cn(
                "w-5 h-5",
                post.liked ? "fill-current text-red-500" : "text-gray-500"
              )} 
            />
            <span className="ml-2">{post.likes}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleComments}
            className="hover:bg-teal-50 transition-colors duration-200 flex items-center"
          >
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span className="ml-2">{post.comments.length}</span>
            {isCommentsOpen ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-teal-50 transition-colors duration-200"
          >
            <Share2 className="w-5 h-5 text-gray-500" />
            <span className="ml-2">{post.shares}</span>
          </Button>
        </div>
      </CardFooter>

      {showComments && (
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="max-h-96 overflow-y-auto space-y-4 mb-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-teal-100">{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-teal-900">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">{comment.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 ">
            <Input 
              placeholder="Add your thoughts..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              className="flex-grow focus:ring-teal-500 focus:border-teal-500"
            />
            <Button 
              size="sm"
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
});

const HealthFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'forYou' | 'trending' | 'latest'>('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const initialPosts: Post[] = [
        {
          id: '1',
          author: {
            id: 'dr_sarah',
            name: 'Dr. Sarah Johnson',
            avatar: '/logo.ico',
            role: 'Nutritionist',
            verified: true
          },
          content: 'New research suggests that incorporating Mediterranean diet principles can significantly improve heart health and cognitive function. Here are the key takeaways from the latest study...',
          timestamp: '2 hours ago',
          likes: 245,
          liked: false,
          comments: [
            {
              id: '1',
              author: {
                id: 'user1',
                name: 'Anonymous User',
                avatar: '/default-avatar.png',
                role: 'juliet',
                verified: false
              },
              content: "Great article!",
              timestamp: '2 hours ago',
              likes: 10
            },
            {
              id: '2', 
              author: {
                id: 'user2',
                name: 'Anonymous User',
                avatar: '/default-avatar.png',
                role: 'phd',
                verified: false
              },
              content: "Thanks for sharing this valuable information.",
              timestamp: '2 hours ago',
              likes: 10
            },
            {
              id: '3',
              author: {
                id: 'user3',
                name: 'Anonymous User',
                avatar: '/default-avatar.png',
                role: 'romeo',
                verified: false
              },
              content: "I'm going to start incorporating these changes right away.",
              timestamp: '2 hours ago',
              likes: 10
            }
          ],
          shares: 18,
          tags: ['Nutrition', 'Research', 'Heart Health'],
          readTime: '3 min read',
          trending: true,
          image: '/logo.ico'
        },
        {
          id: '2',
          author: {
            id: 'coach_mike',
            name: 'Coach Mike',
            avatar: '/logo.ico',
            role: 'Fitness Expert',
            verified: true
          },
          content: 'Stop focusing on lengthy cardio sessions! High-Intensity Interval Training (HIIT) can give you better results in less time. Here\'s a 20-minute workout that burns more calories than an hour of jogging...',
          timestamp: '4 hours ago',
          likes: 189,
          liked: false,
          comments: [
            {
              id: '1',
              author: {
                id: 'fitness_enthusiast',
                name: 'Sarah Johnson',
                avatar: '/default-avatar.png',
                role: 'Fitness Trainer',
                verified: false
              },
              content: "This HIIT workout looks intense but effective! I'll definitely try it with my clients.",
              timestamp: '1 hour ago',
              likes: 15
            },
            {
              id: '2',
              author: {
                id: 'gym_lover',
                name: 'Mark Wilson',
                avatar: '/default-avatar.png',
                role: 'Amateur Athlete',
                verified: false
              },
              content: "I've been doing HIIT for 6 months now and the results are amazing. Great tips Coach!",
              timestamp: '2 hours ago', 
              likes: 8
            },
            {
              id: '3',
              author: {
                id: 'health_pro',
                name: 'Dr. Emily Chen',
                avatar: '/default-avatar.png',
                role: 'Sports Medicine',
                verified: true
              },
              content: "Important reminder to warm up properly before attempting any HIIT workout to prevent injury.",
              timestamp: '3 hours ago',
              likes: 25
            }
          ],
          shares: 24,
          tags: ['Fitness', 'HIIT', 'Workout'],
          readTime: '4 min read',
          trending: true,
          image: '/logo.ico'
        }
      ];

      setPosts(initialPosts);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked 
            } 
          : post
      )
    );
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
              avatar: '/logo.ico',
              role: 'Member',
              verified: false
            },
            content: commentText,
            timestamp: 'Just now',
            likes: 0
          };

          return {
            ...post,
            comments: [newComment, ...post.comments]
          };
        }
        return post;
      })
    );
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilters = filters.length === 0 || 
        post.tags.some(tag => filters.includes(tag.toLowerCase()));
      
      const matchesTab = 
        selectedTab === 'trending' ? post.trending :
        selectedTab === 'latest' ? true :
        true;

      return matchesSearch && matchesFilters && matchesTab;
    });
  }, [posts, searchQuery, filters, selectedTab]);

  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
    const [showPostSuccess, setShowPostSuccess] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPostWindowOpen, setIsPostWindowOpen] = useState(false);

    const handlePostSubmit = async (formData: FormData) => {
      try {
        setIsPostSubmitting(true);

        // Create new post
        const newPost: Partial<Post> = {
          id: Date.now().toString(),
          author: {
            id: 'current-user',
            name: 'You', 
            avatar: '/logo.ico',
            role: 'Member',
            verified: false
          },
          content: formData.get('content') as string,
          timestamp: 'Just now',
          likes: 0,
          liked: false,
          comments: [],
          shares: 0,
          tags: Array.from(formData.getAll('tags') as string[]),
          readTime: '1 min read',
          trending: false
        };

        setPosts(currentPosts => [newPost as Post, ...currentPosts]);
        
        // Reset form and close window
        setPostContent('');
        setSelectedTags([]);
        setIsPostWindowOpen(false);
        
        // Show success message
        setShowPostSuccess(true);
        setTimeout(() => setShowPostSuccess(false), 3000);

        toast({
          title: "Post created",
          description: "Your post has been shared successfully!",
          className: "bg-teal-50 border-teal-500"
        });

      } catch (error) {
        toast({
          title: "Error", 
          description: "Failed to create post. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsPostSubmitting(false);
      }
    };

  return (
    
    <>
    
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 sm:py-8 px-4 mb-0 rounded-lg shadow-lg">
      <div className="container mx-auto max-w-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Health & Wellness Feed</h1>
            <p className="text-teal-100">Share and discover health insights from experts</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-teal-400 hover:bg-teal-300">
              <TrendingUp className="w-4 h-4 mr-1" />
              {posts.length} Posts
            </Badge>
          </div>
        </div>
      </div>
    </div>

    {/* Floating Action Button for New Post */}
    <div className="fixed bottom-4 sm:bottom-2 right-2 z-50">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg bg-teal-500 hover:bg-teal-600 text-white"
        >
          <BadgePlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[90vw] overflow-y-auto max-h-[80vh] sm:w-[400px] p-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const newPost: Partial<Post> = {
            id: Date.now().toString(),
            author: {
              id: 'current-user',
              name: 'You',
              avatar: '/logo.ico',
              role: 'Member',
              verified: false
            },
            content: formData.get('content') as string,
            timestamp: 'Just now',
            likes: 0,
            liked: false,
            comments: [],
            shares: 0,
            tags: Array.from(formData.getAll('tags') as string[]),
            readTime: formData.get('readTime') as string,
            trending: false
          };

          setPosts(prev => [newPost as Post, ...prev]);
          toast({
            title: "Post Created",
            description: "Your insights have been shared with the community!",
            className: "bg-teal-50 border-teal-500"
          });
          e.currentTarget.reset();
        }}>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-teal-900">Create New Post</h3>

            <div>
              <label htmlFor="content" className="text-sm font-medium text-teal-700">Content</label>
              <textarea
                id="content"
                name="content"
                required
                className="mt-1 w-full rounded-md border-teal-300 focus:border-teal-500 focus:ring focus:ring-teal-200 min-h-[100px]"
                placeholder="Share your health insights..." />
            </div>

            <div>
              <label className="text-sm font-medium text-teal-700">Tags</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tags"
                      value={category.label}
                      className="rounded border-teal-300 text-teal-500 focus:ring-teal-200"
                    />
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-teal-50"
                    >
                      {category.icon} {category.label}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="readTime" className="text-sm font-medium text-teal-700">Estimated Read Time</label>
              <Input
                id="readTime"
                name="readTime"
                type="text"
                required
                placeholder="e.g. 3 min read"
                className="mt-1 border-teal-300 focus:border-teal-500 focus:ring-teal-200" />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              Publish Post
            </Button>
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div className="container mx-auto max-w-3xl px-4 py-4 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
          <Input
            placeholder="Search posts, authors, or tags..."
            className="pl-10 border-teal-300 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <Filter className="mr-2 text-teal-500" />
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {categories.map(category => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => {
                  setFilters(prev => prev.includes(category.id)
                    ? prev.filter(f => f !== category.id)
                    : [...prev, category.id]
                  );
                } }
                className={cn(
                  "cursor-pointer hover:bg-teal-50 transition-colors duration-200",
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

      <Tabs
        value={selectedTab}
        onValueChange={(value: any) => setSelectedTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger
            value="forYou"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-colors duration-200"
          >
            For You
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-colors duration-200"
          >
            <TrendingUp className="hidden sm:inline-block w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="latest"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-colors duration-200"
          >
            Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forYou" className="mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="mb-6">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Card key={i} className="mb-6">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            filteredPosts
              .filter(post => post.trending)
              .map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment} />
              ))
          )}
        </TabsContent>

        <TabsContent value="latest" className="mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Card key={i} className="mb-6">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            filteredPosts
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment} />
              ))
          )}
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilters([]);
              setSelectedTab('forYou');
            } }
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default HealthFeed;