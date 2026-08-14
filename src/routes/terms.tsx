import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms and Conditions — GO FARM WORK" },
      { name: "description", content: "Terms and Conditions for using Go Farm Work." },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12 border border-border">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-8">
              Terms and Conditions
            </h1>
            
            <div className="prose prose-green max-w-none space-y-6 text-muted-foreground">
              <p><strong>Last Updated: August 2026</strong></p>
              
              <p>
                Welcome to Go Farm Work. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By creating an account, posting a job, or accepting work through Go Farm Work, you confirm that you accept these terms and agree to comply with them. If you do not agree, you must not use our platform.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You must be at least 18 years old to use this platform.</li>
                <li>We reserve the right to suspend or terminate accounts that violate our community guidelines.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Farm Work & Escrow Payments</h2>
              <p>
                Go Farm Work acts as a marketplace connecting farm owners with agricultural workers. We provide an escrow payment system to ensure secure transactions.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Farm Owners:</strong> When you hire a worker, the agreed payment is held securely in escrow until the work is completed and approved.</li>
                <li><strong>Workers:</strong> You are guaranteed payment for completed, approved work as agreed upon in the job terms.</li>
                <li>Disputes regarding completed work will be mediated by the Go Farm Work support team.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Prohibited Conduct</h2>
              <p>Users of Go Farm Work agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post false, misleading, or deceptive job listings.</li>
                <li>Use the platform for any illegal agricultural practices.</li>
                <li>Harass, abuse, or discriminate against other users.</li>
                <li>Attempt to bypass the escrow payment system to avoid platform fees.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Liability</h2>
              <p>
                While we strive to vet all users, Go Farm Work is not responsible for the actual performance of the work, the safety of the working environment, or the quality of the harvest. Users enter into agreements at their own risk.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. Changes to Terms</h2>
              <p>
                We may revise these Terms and Conditions at any time. We will notify you of any significant changes by posting the new terms on the platform.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@gofarmwork.in.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
