import React, { useState } from "react";
import img1 from "../../assets/images/logo 1.png";
import "./WhatsAppChat.css"
import { Link } from "react-router-dom";

const WhatsAppChat = () => {
  const [chatInput, setChatInput] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedNumber, setSelectedNumber] = useState("80976 99450");
  // eslint-disable-next-line no-unused-vars
  const [selectedName, setSelectedName] = useState("UMC");
  // eslint-disable-next-line no-unused-vars
  const [selectedLabel, setSelectedLabel] = useState(
    "Typically replies within an hour"
  );
  const [isChatVisible, setIsChatVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isHomeVisible, setIsHomeVisible] = useState(true);

  const sendWhatsAppMessage = () => {
    if (chatInput !== "") {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const baseUrl = isMobileDevice
        ? "whatsapp://send"
        : "https://web.whatsapp.com/send";
      const message = encodeURIComponent(chatInput);
      const whatsappUrl = `${baseUrl}?phone=${selectedNumber}&text=${message}`;
      window.open(whatsappUrl, "_blank");
      setChatInput("");
      setIsChatVisible(false);
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  return (
    <div>
      <div id="whatsapp-chat" className={isChatVisible ? "show" : "hide"}>
        <div className="header-chat">
          {isHomeVisible ? (
            <div className="head-home">
              <div className="info-avatar">
                <img src={img1} alt="" />
              </div>
              <p>
                <span className="whatsapp-name">UMC</span>
                <br />
                <small>Typically replies within an hour</small>
              </p>
            </div>
          ) : (
            <div className="get-new">
              <div id="get-label">{selectedLabel}</div>
              <div id="get-nama">{selectedName}</div>
            </div>
          )}
        </div>

        <div className="start-chat">
          <div
            pattern="https://elfsight.com/assets/chats/patterns/whatsapp.png"
            className="WhatsappChat__Component-sc-1wqac52-0 whatsapp-chat-body"
          >
            <div className="WhatsappChat__MessageContainer-sc-1wqac52-1 dAbFpq">
              <div
                style={{ opacity: "0" }}
                className="WhatsappDots__Component-pks5bf-0 eJJEeC"
              >
                <div className="WhatsappDots__ComponentInner-pks5bf-1 hFENyl">
                  <div className="WhatsappDots__Dot-pks5bf-2 WhatsappDots__DotOne-pks5bf-3 ixsrax"></div>
                  <div className="WhatsappDots__Dot-pks5bf-2 WhatsappDots__DotTwo-pks5bf-4 dRvxoz"></div>
                  <div className="WhatsappDots__Dot-pks5bf-2 WhatsappDots__DotThree-pks5bf-5 kXBtNt"></div>
                </div>
              </div>
              <div
                style={{ opacity: "1" }}
                className="WhatsappChat__Message-sc-1wqac52-4 kAZgZq"
              >
                <div className="WhatsappChat__Author-sc-1wqac52-3 bMIBDo">
                  UMC
                </div>
                <div className="WhatsappChat__Text-sc-1wqac52-2 iSpIQi">
                  Hi there 👋
                  <br />
                  <br />
                  How can I help you?
                </div>
                <div className="WhatsappChat__Time-sc-1wqac52-5 cqCDVm">
                  1:40
                </div>
              </div>
            </div>
          </div>

          <div className="blanter-msg">
            <textarea
              id="chat-input"
              placeholder="Write a response"
              maxLength="120"
              rows="1"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            ></textarea>
            <Link to="#" id="send-it" onClick={sendWhatsAppMessage}>
              <svg viewBox="0 0 448 448">
                <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" />
              </svg>
            </Link>
          </div>
        </div>

        <div id="get-number"></div>
        <Link className="close-chat" to="#" onClick={closeChat}>
          ×
        </Link>
      </div>

      <Link
        className="blantershow-chat"
        to="#"
        title="Show Chat"
        onClick={toggleChatVisibility}
      >
        <svg width="20" viewBox="0 0 24 24">
          <defs />
          <path
            fill="#eceff1"
            d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z"
          />
          <path
            fill="#4caf50"
            d="M12 21.8c-3.1 0-5.2-1.6-5.4-1.6l-3.7 1 1-3.7-.3-.4A9.9 9.9 0 012.1 12a10 10 0 0117-7 9.9 9.9 0 01-7 16.9z"
          />
          <path
            fill="#fafafa"
            d="M17.5 14.3c-.3 0-1.8-.8-2-.9-.7-.2-.5 0-1.7 1.3-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5a9 9 0 01-1.7-2c-.3-.6.4-.6 1-1.7l-.1-.5-1-2.2c-.2-.6-.4-.5-.6-.5-.6 0-1 0-1.4.3-1.6 1.8-1.2 3.6.2 5.6 2.7 3.5 4.2 4.2 6.8 5 .7.3 1.4.3 1.9.2.6 0 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"
          />
        </svg>
        Chat with Us
      </Link>
    </div>
  );
};

export default WhatsAppChat;
