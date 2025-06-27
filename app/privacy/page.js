import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground">
            <p><em>Last updated: January 2025</em></p>
            
            <h2>Information We Collect</h2>
            <p>
              When you use our loan matching service, we collect personal information necessary to connect you with potential lenders, including:
            </p>
            <ul>
              <li>Personal identifiers (name, address, phone number, email)</li>
              <li>Financial information (income, employment, banking details)</li>
              <li>Government identifiers (Social Security Number, Driver's License)</li>
              <li>Loan preferences and requirements</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Match you with qualified lenders in our network</li>
              <li>Facilitate loan applications and approvals</li>
              <li>Communicate with you about loan opportunities</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>
              We share your information with:
            </p>
            <ul>
              <li><strong>Lenders:</strong> We share your information with lenders in our network who may be able to provide you with a loan</li>
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls.
            </p>
            
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we have about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>
              For questions about this Privacy Policy, contact us at:<br/>
              Email: privacy@cashmoney.monster<br/>
              Phone: 1-800-CASH-NOW
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}