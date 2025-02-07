import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mt-3">
            Your privacy is important to us. Learn how we protect your data with
            transparency and care.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {[
            {
              title: "Information Collection",
              content:
                "We collect personal information that you provide to us, such as your name, email address, and payment details. This information helps us to serve you better and personalize your experience.",
            },
            {
              title: "Usage of Information",
              content:
                "Your information is used to process orders, improve our services, and send promotional materials. We ensure your data is handled responsibly and securely.",
            },
            {
              title: "Data Security",
              content:
                "We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. Your trust and safety are our top priorities.",
            },
            {
              title: "Cookies and Tracking",
              content:
                "Our website uses cookies to enhance your browsing experience. Cookies help us remember your preferences, understand user behavior, and provide relevant content. You can manage cookies through your browser settings.",
            },
            {
              title: "Third-Party Sharing",
              content:
                "We do not sell your personal information. However, we may share your data with trusted partners who assist in providing our services, under strict confidentiality agreements to ensure your privacy.",
            },
            {
              title: "Your Rights",
              content:
                "You have the right to access, correct, or delete your personal data at any time. For assistance, please contact us at ",
            },
          ].map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                {section.content}
                {section.title === "Your Rights" && (
                  <a
                    href="mailto:akbarfajar2112@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    akbarfajar2112@gmail.com
                  </a>
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
