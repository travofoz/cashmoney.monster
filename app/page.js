import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

/**
 * Home page component
 * @returns {JSX.Element} Home page
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <ModeToggle />
        </div>
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            Cash Money
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the cash you need today with quick approval on payday, personal, and installment loans.
          </p>
          
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Quick Cash Approval</CardTitle>
              <CardDescription>
                Fast, secure, and reliable loan processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}