import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Your privacy is important to us. Learn how we protect your data with transparency and care.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Information Collection
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                We collect personal information that you provide to us, such as your name, email
                address, and payment details. This information helps us to serve you better and
                personalize your experience.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Usage of Information
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Your information is used to process orders, improve our services, and send promotional
                materials. We ensure your data is handled responsibly and securely.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                We implement industry-standard security measures, including encryption and secure
                servers, to protect your personal information. Your trust and safety are our top
                priorities.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Our website uses cookies to enhance your browsing experience. Cookies help us
                remember your preferences, understand user behavior, and provide relevant content. You
                can manage cookies through your browser settings.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Third-Party Sharing
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                We do not sell your personal information. However, we may share your data with
                trusted partners who assist in providing our services, under strict confidentiality
                agreements to ensure your privacy.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                You have the right to access, correct, or delete your personal data at any time. For
                assistance, please contact us at{" "}
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="text-blue-500 hover:underline"
                >
                  akbarfajar2112@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
