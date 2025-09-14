import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
}

export function FormattedMessage({ children }: MarkdownProps) {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        // Add more custom components for other tags if needed
      }}
    >
      {children}
    </Markdown>
  );
}