import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaGlobe,
  FaUserShield,
  FaGavel,
  FaCopyright,
  FaExclamationTriangle,
  FaSyncAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulasikan loading selama 2 detik
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
        <FaGlobe className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Use of Website",
      content:
        "Our website and services are intended for personal, non-commercial use only. You agree to use the site responsibly and comply with applicable laws and regulations. Any misuse or unauthorized access may result in legal actions.",
    },
    {
      icon: (
        <FaUserShield className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Account Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. Notify us immediately of any unauthorized access or security breaches. We are not liable for losses caused by your failure to safeguard your account.",
    },
    {
      icon: (
        <FaGavel className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Termination",
      content:
        "We reserve the right to terminate or suspend access to our services without prior notice for any reason, including but not limited to violations of these terms or illegal activities.",
    },
    {
      icon: (
        <FaCopyright className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Intellectual Property",
      content:
        "All content on this website, including text, images, logos, and software, is the intellectual property of MyCoffee or its licensors. Unauthorized use or reproduction is strictly prohibited.",
    },
    {
      icon: (
        <FaExclamationTriangle className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Limitation of Liability",
      content:
        "To the extent permitted by law, MyCoffee is not liable for any damages arising from your use of our services, including direct, indirect, or incidental losses. Use our services at your own risk.",
    },
    {
      icon: (
        <FaSyncAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Changes to Terms",
      content:
        "We reserve the right to update these Terms of Service at any time. Continued use of our services after changes indicates your acceptance of the updated terms.",
    },
    {
      icon: (
        <FaEnvelope className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Contact Us",
      content: (
        <>
          If you have any questions or concerns regarding these terms, please
          contact us at{" "}
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
      <div className="relative max-w-4xl w-full bg-white/80 dark:bg-gray-800/80 shadow-2xl backdrop-blur-lg rounded-3xl p-8">
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Please read these terms carefully before using our services.
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

export default TermsOfService;
