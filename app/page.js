import LoanApplicationForm from "@/components/LoanApplicationForm"
import { ModeToggle } from "@/components/mode-toggle"

/**
 * Home page component - Main loan application
 * @returns {JSX.Element} Home page with loan form
 */
export default function Home() {
  return (
    <main className="relative">
      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      {/* Main loan application form */}
      <LoanApplicationForm />
    </main>
  )
}