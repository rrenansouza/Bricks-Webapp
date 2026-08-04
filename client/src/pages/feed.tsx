import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Dumbbell,
  Trophy,
  Lightbulb,
  TrendingUp,
  ImageIcon,
  X,
  Loader2,
  Image,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostUser {
  id: string;
  name: string;
  photoUrl: string | null;
  userType: string;
}

interface PostComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: { name: string; photoUrl: string | null };
}

interface FeedPost {
  id: string;
  userId: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  postType: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user: PostUser;
  userLiked?: boolean;
}

const POST_TYPES = [
  { value: "general", label: "Geral", icon: Send },
  { value: "workout_check", label: "Check-in de Treino", icon: Dumbbell },
  { value: "progress", label: "Evolução", icon: TrendingUp },
  { value: "achievement", label: "Conquista", icon: Trophy },
  { value: "tip", label: "Dica", icon: Lightbulb },
];

function getPostTypeLabel(type: string) {
  return POST_TYPES.find((t) => t.value === type)?.label || "Geral";
}

function getPostTypeIcon(type: string) {
  const T = POST_TYPES.find((t) => t.value === type);
  return T ? <T.icon className="w-3 h-3" /> : <Send className="w-3 h-3" />;
}

function PostCard({ post }: { post: FeedPost }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: comments, isLoading: commentsLoading } = useQuery<PostComment[]>({
    queryKey: [`/api/feed/${post.id}/comments`],
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (post.userLiked) {
        return apiRequest("DELETE", `/api/feed/${post.id}/like`);
      }
      return apiRequest("POST", `/api/feed/${post.id}/like`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/feed"] }),
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) =>
      apiRequest("POST", `/api/feed/${post.id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/feed/${post.id}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      setCommentText("");
    },
    onError: () => toast({ title: "Erro ao comentar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => apiRequest("DELETE", `/api/feed/${post.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/feed"] }),
    onError: () => toast({ title: "Erro ao excluir", variant: "destructive" }),
  });

  const initials = post.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4 px-4 pb-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.photoUrl || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{post.user.name}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-primary/30 text-primary"
                >
                  {post.user.userType === "personal" ? "Personal" : "Aluno"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  {getPostTypeIcon(post.postType)}
                  {getPostTypeLabel(post.postType)}
                </span>
                <span>·</span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR, addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          {user?.id === post.userId && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => deleteMutation.mutate()}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>

        {/* Media */}
        {post.mediaUrl && post.mediaType === "image" && (
          <div className="rounded-lg overflow-hidden mb-3 bg-muted">
            <img
              src={post.mediaUrl}
              alt="Mídia da publicação"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        <Separator className="mb-2" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 text-sm ${post.userLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
          >
            <Heart className={`w-4 h-4 ${post.userLiked ? "fill-current" : ""}`} />
            <span>{post.likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 text-sm ${showComments ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 space-y-3">
            <Separator />
            {commentsLoading && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {comments?.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarImage src={c.user.photoUrl || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                    {c.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-xs font-semibold mb-0.5">{c.user.name}</p>
                  <p className="text-xs text-muted-foreground">{c.content}</p>
                </div>
              </div>
            ))}
            {comments?.length === 0 && !commentsLoading && (
              <p className="text-xs text-muted-foreground text-center py-1">Nenhum comentário ainda</p>
            )}
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                className="h-8 text-sm bg-muted/50 border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && commentText.trim()) {
                    commentMutation.mutate(commentText);
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8 px-3 bg-primary text-primary-foreground"
                disabled={!commentText.trim() || commentMutation.isPending}
                onClick={() => commentMutation.mutate(commentText)}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newContent, setNewContent] = useState("");
  const [newPostType, setNewPostType] = useState("general");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);

  const { data: posts, isLoading } = useQuery<FeedPost[]>({
    queryKey: ["/api/feed"],
  });

  const createMutation = useMutation({
    mutationFn: async () =>
      apiRequest("POST", "/api/feed", {
        content: newContent,
        postType: newPostType,
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaUrl ? "image" : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      setNewContent("");
      setMediaUrl("");
      setShowMediaInput(false);
      setNewPostType("general");
      toast({ title: "Publicação criada!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        </div>

        {/* Compose */}
        <Card className="bg-card border-border">
          <CardContent className="pt-4 px-4 pb-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Compartilhe sua evolução, dica ou conquista..."
                  className="resize-none bg-muted/50 border-border text-sm min-h-[80px]"
                />
                {showMediaInput && (
                  <div className="flex gap-2">
                    <Input
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="URL da imagem..."
                      className="text-sm bg-muted/50 border-border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={() => { setShowMediaInput(false); setMediaUrl(""); }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Select value={newPostType} onValueChange={setNewPostType}>
                      <SelectTrigger className="h-8 text-xs bg-muted/50 border-border w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POST_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value} className="text-xs">
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowMediaInput(!showMediaInput)}
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!newContent.trim() || createMutation.isPending}
                    onClick={() => createMutation.mutate()}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1.5" /> Publicar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Dumbbell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma publicação ainda.</p>
              <p className="text-sm text-muted-foreground mt-1">Seja o primeiro a compartilhar algo!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
