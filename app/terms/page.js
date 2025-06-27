import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground">
            <p><em>Last updated: January 2025</em></p>
            
            <h2>Service Description</h2>
            <p>
              Cash Money MONSTER ("we," "us," or "our") operates a loan matching service that connects borrowers with independent lenders. We are not a lender and do not make loans directly.
            </p>
            
            <h2>Eligibility</h2>
            <p>To use our service, you must:</p>
            <ul>
              <li>Be at least 18 years old</li>
              <li>Be a U.S. citizen or permanent resident</li>
              <li>Have a valid checking account</li>
              <li>Have a steady source of income</li>
              <li>Provide accurate and complete information</li>
            </ul>
            
            <h2>No Guarantee of Loan Approval</h2>
            <p>
              We do not guarantee that you will be matched with a lender or approved for a loan. Loan approval and terms are determined solely by individual lenders based on their own criteria.
            </p>
            
            <h2>Loan Terms and Conditions</h2>
            <p>
              All loan terms, including interest rates, fees, repayment periods, and other conditions, are determined by the individual lenders. We are not responsible for any aspect of the loan agreement between you and the lender.
            </p>
            
            <h2>Fees</h2>
            <p>
              Our service is free to borrowers. We receive compensation from lenders when we successfully connect them with qualified borrowers.
            </p>
            
            <h2>Privacy and Data Use</h2>
            <p>
              By using our service, you consent to our collection, use, and sharing of your personal information as described in our Privacy Policy.
            </p>
            
            <h2>Responsible Borrowing</h2>
            <p>
              We encourage responsible borrowing. Only borrow what you can afford to repay. Consider all alternatives before taking out a short-term loan.
            </p>
            
            <h2>State Regulations</h2>
            <p>
              Loan availability and terms vary by state. Some states may prohibit certain types of loans. We comply with all applicable state and federal regulations.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              We are not liable for any damages arising from your use of our service or any loan obtained through our platform. Our liability is limited to the maximum extent permitted by law.
            </p>
            
            <h2>Contact Information</h2>
            <p>
              For questions about these Terms of Service:<br/>
              Email: legal@cashmoney.monster<br/>
              Phone: 1-800-CASH-NOW
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}