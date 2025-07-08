import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MDXRemote } from 'next-mdx-remote';
import { getMarkdownContent } from '@/utils/markdownProcessor';

export default async function RatesAndFees() {
  const { content, frontmatter } = await getMarkdownContent('rates-and-fees');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {frontmatter.title || 'Rates & Fees'}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground">
            <MDXRemote {...content} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}