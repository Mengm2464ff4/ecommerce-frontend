import { Cookie, Info, Settings, Shield } from "lucide-react";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
            <Cookie className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Cookie Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          <Section icon={Info} title="What Are Cookies?">
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help us remember your preferences, keep you logged
              in, and improve your shopping experience.
            </p>
          </Section>

          <Section icon={Settings} title="Types of Cookies We Use">
            <ul className="space-y-3">
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Essential
                </strong>{" "}
                — required for login, cart, and checkout to work.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Preference
                </strong>{" "}
                — remember language, theme (dark/light), and currency.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Analytics
                </strong>{" "}
                — help us understand which pages are popular.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Marketing
                </strong>{" "}
                — used to show relevant products and offers.
              </li>
            </ul>
          </Section>

          <Section icon={Shield} title="Managing Cookies">
            <p>
              You can control cookies through your browser settings. Disabling
              essential cookies may prevent parts of ShopHub from working
              correctly.
            </p>
            <p className="mt-3">Most browsers allow you to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>View cookies and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Block all cookies from being set</li>
            </ul>
          </Section>

          <Section icon={Info} title="Third-Party Cookies">
            <p>
              We use a small number of trusted third-party services (payment
              processors, analytics, and support chat). These may set their own
              cookies. We do not control those cookies — see each provider's
              privacy policy for details.
            </p>
          </Section>

          <Section icon={Info} title="Updates to This Policy">
            <p>
              We may update this policy from time to time. When we do, we'll
              revise the "Last updated" date at the top. Continued use of
              ShopHub after changes means you accept the updated policy.
            </p>
          </Section>

          <Section icon={Info} title="Contact">
            <p>
              Questions? Email{" "}
              <a
                href="mailto:privacy@shophub.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                privacy@shophub.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
