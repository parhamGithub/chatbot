import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GradientBorder } from "../tools/gradientBorder";

interface MessageCardProps {
  content: React.ReactNode;
  isUser: boolean;
  latestIndex?: boolean;
}

export function MessageCard({ content, isUser, latestIndex=false }: MessageCardProps) {
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
      {
        !isUser && latestIndex ? (
          <GradientBorder classNameP={`rounded-bl-none w-fit max-w-1/2`} rounded="3xl rounded-bl-none">
            <Card
              className={cn(
                "w-fit rounded-3xl",
                isUser
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-muted-foreground rounded-bl-none"
              )}
            >
              <CardContent className="p-4">
                {content}
              </CardContent>
            </Card>
          </GradientBorder>
        ) : (
          <Card
            className={cn(
              "w-fit rounded-3xl max-w-1/2",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-muted text-muted-foreground rounded-bl-none"
            )}
          >
            <CardContent className="p-4">
              {content}
            </CardContent>
          </Card>
        )
      }
      
    </div>
  );
}
