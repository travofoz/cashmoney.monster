import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMarkdownContent } from '@/utils/markdownProcessor';

export default function TCPANotice() {
  const { content, frontmatter } = getMarkdownContent('tcpa-notice');
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {frontmatter.title || 'TCPA Notice'}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-foreground">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}