import React from "react";

const TermsOfService = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Use of Website
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Our website and services are intended for personal,
                non-commercial use only. You agree to use the site responsibly
                and comply with applicable laws and regulations. Any misuse or
                unauthorized access may result in legal actions.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Account Responsibilities
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                account and password. Notify us immediately of any unauthorized
                access or security breaches. We are not liable for losses caused
                by your failure to safeguard your account.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                We reserve the right to terminate or suspend access to our
                services without prior notice for any reason, including but not
                limited to violations of these terms or illegal activities.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Intellectual Property
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                All content on this website, including text, images, logos, and
                software, is the intellectual property of MyCoffee or its
                licensors. Unauthorized use or reproduction is strictly
                prohibited.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                To the extent permitted by law, MyCoffee is not liable for any
                damages arising from your use of our services, including direct,
                indirect, or incidental losses. Use our services at your own
                risk.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                We reserve the right to update these Terms of Service at any
                time. Continued use of our services after changes indicates your
                acceptance of the updated terms.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                If you have any questions or concerns regarding these terms,
                please contact us at{" "}
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="text-blue-500 hover:underline"
                >
                  akbarfajar2112@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
