import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import './index.less';

export interface CardButton {
  id: string;
  name: string;
  type?: string;
}

export interface CardItem {
  id: string;
  title: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  buttons?: CardButton[];
  summary?: string;
}

export interface MessageItem {
  id: string;
  content: string;
  isUser?: boolean;
  timestamp?: string;
}

export interface TabItem {
  id: string;
  name: string;
  subTabs?: TabItem[];
  type?: 'add' | 'page' | 'phone' | 'message' | 'send';
}

interface PhonePreviewProps {
  cards?: CardItem[];
  messages?: MessageItem[];
  tabs?: TabItem[];
  onTabClick?: (tab: TabItem) => void;
  onAddSubMenu?: () => void;
  onSubMenuClick?: (tab: TabItem) => void;
  floatingButtons?: CardButton[];
  onFloatingButtonClick?: (button: CardButton) => void;
  title?: string;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({
  cards,
  messages,
  tabs,
  onTabClick,
  onAddSubMenu,
  onSubMenuClick,
  floatingButtons,
  onFloatingButtonClick,
  title = '博瑞天下',
}) => {
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const buttonsScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTabClick = (tab: TabItem) => {
    if (tab.type === 'add') {
      onAddSubMenu?.();
    } else {
      onTabClick?.(tab);
      setActiveTabId(activeTabId === tab.id ? null : tab.id);
    }
  };

  const getActiveSubTabs = () => {
    if (!activeTabId || !tabs) return null;
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return activeTab?.subTabs;
  };

  const renderMediaContent = (card: CardItem) => {
    if (!card.mediaUrl) return null;
    switch (card.mediaType) {
      case 'image':
        return <img src={card.mediaUrl} alt={card.title} />;
      case 'video':
        return (
          <video controls>
            <source src={card.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls>
            <source src={card.mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return null;
    }
  };

  return (
    <div className="phone-preview">
      <div className="phone-frame">
        {/* Status Bar */}

        {/* Header */}
        <div className="header">
          <div className="back-button">
            <LeftOutlined />
          </div>
          <div className="title">{title}</div>
          <div className="placeholder"></div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Cards Section */}
          {cards && cards.length > 0 && (
            <div
              className="cards-section"
              ref={cardsScrollRef}
              onMouseDown={(e) => handleMouseDown(e, cardsScrollRef)}
              onMouseUp={handleMouseUp}
              onMouseMove={(e) => handleMouseMove(e, cardsScrollRef)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="cards-scroll">
                {cards.map((card) => (
                  <div key={card.id} className="card-item">
                    <div className="card-media">{renderMediaContent(card)}</div>
                    <div className="card-content">
                      <div
                        className="card-title text-[14px] mb-[0px]"
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        className=" text-[14px] text-[#999]"
                        style={{
                          fontWeight: 400,
                        }}
                      >
                        {card.summary}
                      </div>
                      {card.buttons && card.buttons.length > 0 && (
                        <div className="card-buttons">
                          {card.buttons.map((button) => (
                            <div key={button.id} className="card-button">
                              {button.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Section */}
          {messages && messages.length > 0 && (
            <div className="messages-section">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-item ${message.isUser ? 'user-message' : 'system-message'}`}
                >
                  <div className="message-content">{message.content}</div>
                  {message.timestamp && <div className="message-time">{message.timestamp}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Buttons */}
        {floatingButtons && floatingButtons.length > 0 && (
          <div className="floating-buttons">
            <div
              className="floating-buttons-scroll"
              ref={buttonsScrollRef}
              onMouseDown={(e) => handleMouseDown(e, buttonsScrollRef)}
              onMouseUp={handleMouseUp}
              onMouseMove={(e) => handleMouseMove(e, buttonsScrollRef)}
              onMouseLeave={handleMouseLeave}
            >
              {floatingButtons.map((button) => (
                <div
                  key={button.id}
                  className="floating-button"
                  onClick={() => onFloatingButtonClick?.(button)}
                >
                  <span className="button-name">{button.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Area */}
        <div className="bottom-area">
          {tabs && tabs.length > 0 ? (
            <div className="bottom-tabs">
              {tabs.slice(0, 3).map((tab) => (
                <div
                  key={tab.id}
                  className={`tab-item ${tab.type === 'add' ? 'add-tab' : ''} ${
                    activeTabId === tab.id ? 'active' : ''
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.type === 'add' ? (
                    <PlusOutlined className="add-icon" />
                  ) : (
                    <span className="tab-name">{tab.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="message-input">
              <div className="input-placeholder">发送信息...</div>
            </div>
          )}

          {/* Sub Menu */}
          {activeTabId && getActiveSubTabs() && (
            <div className="sub-menu">
              {getActiveSubTabs()?.map((tab) => (
                <div key={tab.id} className="sub-menu-item" onClick={() => onSubMenuClick?.(tab)}>
                  {tab.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
