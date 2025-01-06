import React, { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "https://cdn.livechatinc.com/tracking.js";
    document.head.appendChild(script);

    window.__lc = window.__lc || {};
    window.__lc.license = 18974940;
    window.__lc.integration_name = "manual_onboarding";
    window.__lc.product_name = "livechat";

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <noscript>
      <a href="https://www.livechat.com/chat-with/18974940/" rel="nofollow">
        Chat with us
      </a>
      , powered by{" "}
      <a
        href="https://www.livechat.com/?welcome"
        rel="noopener nofollow"
        target="_blank"
      >
        LiveChat
      </a>
    </noscript>
  );
};

export default LiveChat;
