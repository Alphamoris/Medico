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
  Send
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
            onClick={() => setShowComments(!showComments)}
            className="hover:bg-teal-50 transition-colors duration-200"
          >
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span className="ml-2">{post.comments.length}</span>
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
          comments: [],
          shares: 18,
          tags: ['Nutrition', 'Research', 'Heart Health'],
          readTime: '3 min read',
          trending: true
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
          comments: [],
          shares: 24,
          tags: ['Fitness', 'HIIT', 'Workout'],
          readTime: '4 min read',
          trending: true
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
          <Input 
            placeholder="Search posts, authors, or tags..." 
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
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {categories.map(category => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => {
                  setFilters(prev => 
                    prev.includes(category.id) 
                      ? prev.filter(f => f !== category.id)
                      : [...prev, category.id]
                  );
                }}
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
            <TrendingUp className="w-4 h-4 mr-2" />
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
                onComment={handleComment}
              />
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
                  onComment={handleComment}
                />
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
                  onComment={handleComment}
                />
              ))
          )}
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilters([]);
              setSelectedTab('forYou');
            }}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default HealthFeed;