import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">About Cash Money MONSTER</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground">
            <h2>Your Trusted Loan Matching Service</h2>
            <p>
              Cash Money MONSTER is a leading loan matching service that connects borrowers with qualified lenders across the United States. We specialize in payday loans, personal loans, and installment loans up to $1,000.
            </p>
            
            <h3>How It Works</h3>
            <p>
              Our simple process takes just 60 seconds:
            </p>
            <ol>
              <li>Complete our secure online form</li>
              <li>Get matched with qualified lenders</li>
              <li>Review loan offers</li>
              <li>Get cash quickly</li>
            </ol>
            
            <h3>Why Choose Us?</h3>
            <ul>
              <li><strong>Fast:</strong> Get connected with lenders in minutes</li>
              <li><strong>Secure:</strong> Bank-level encryption protects your information</li>
              <li><strong>Free:</strong> Our service is completely free to borrowers</li>
              <li><strong>No Obligation:</strong> You're never obligated to accept any offer</li>
            </ul>
            
            <h3>Important Disclosure</h3>
            <p>
              Cash Money MONSTER is not a lender. We are a loan matching service that connects borrowers with independent lenders. All loan terms, rates, and conditions are determined by the individual lenders. We do not guarantee loan approval or specific terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}