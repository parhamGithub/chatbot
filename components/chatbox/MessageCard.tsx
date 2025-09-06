import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageCardProps {
  content: React.ReactNode;
  isUser: boolean;
}

export function MessageCard({ content, isUser }: MessageCardProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4 items-end",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/8.x/${
            isUser ? "thumbs" : "shapes"
          }/svg?seed=${isUser ? "user" : "bot"}`}
        />
        <AvatarFallback>{isUser ? "U" : "B"}</AvatarFallback>
      </Avatar>
      <Card
        className={cn(
          "w-fit max-w-[75%] rounded-3xl",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-muted-foreground rounded-bl-none"
        )}
      >
        <CardContent className="p-4">
          {content}
        </CardContent>
      </Card>
    </div>
  );
}
