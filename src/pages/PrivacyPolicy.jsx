import React, { useState, useEffect } from "react";
import {
  FaUserSecret,
  FaShieldAlt,
  FaLock,
  FaCookieBite,
  FaShareAlt,
  FaUserCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading selama 2 detik
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-8 flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-6 bg-gray-400 opacity-50 rounded-full animate-steam"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>

          <div className="relative w-20 h-16 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full flex items-end justify-center shadow-lg glow-effect">
            <div className="absolute bottom-0 w-16 h-12 bg-white dark:bg-gray-800 rounded-t-full"></div>
          </div>

          <div className="absolute right-[-10px] top-[6px] w-5 h-5 border-4 border-orange-500 rounded-full"></div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-semibold animate-fade-in">
          Brewing your coffee...
        </p>
      </div>
    );
  }

  const sections = [
    {
      icon: (
        <FaUserSecret className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Information Collection",
      content:
        "We collect personal information that you provide to us, such as your name, email address, and payment details. This information helps us to serve you better and personalize your experience.",
    },
    {
      icon: (
        <FaShieldAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Usage of Information",
      content:
        "Your information is used to process orders, improve our services, and send promotional materials. We ensure your data is handled responsibly and securely.",
    },
    {
      icon: (
        <FaLock className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Data Security",
      content:
        "We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. Your trust and safety are our top priorities.",
    },
    {
      icon: (
        <FaCookieBite className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Cookies and Tracking",
      content:
        "Our website uses cookies to enhance your browsing experience. Cookies help us remember your preferences, understand user behavior, and provide relevant content. You can manage cookies through your browser settings.",
    },
    {
      icon: (
        <FaShareAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Third-Party Sharing",
      content:
        "We do not sell your personal information. However, we may share your data with trusted partners who assist in providing our services, under strict confidentiality agreements to ensure your privacy.",
    },
    {
      icon: (
        <FaUserCheck className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Your Rights",
      content: (
        <>
          You have the right to access, correct, or delete your personal data at
          any time. For assistance, please contact us at{" "}
          <a
            href="mailto:akbarfajar2112@gmail.com"
            className="text-blue-500 hover:underline"
          >
            akbarfajar2112@gmail.com
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative max-w-3xl w-full bg-white/80 dark:bg-gray-800/80 shadow-2xl backdrop-blur-lg rounded-3xl p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition mb-6"
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mt-3">
            Your privacy is important to us. Learn how we protect your data with
            transparency and care.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section
              key={index}
              className="flex gap-4 items-start p-5 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md transition hover:scale-105 duration-300 ease-in-out"
            >
              <div className="text-orange-500 text-2xl">{section.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
