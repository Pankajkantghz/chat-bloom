import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages = [],
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch + live updates
  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages?.length]);

  // Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="sticky top-0 z-20 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
          <ChatHeader />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MessageSkeleton />
        </div>
        <div className="sticky bottom-[max(0px,env(safe-area-inset-bottom))] z-20 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
          <MessageInput />
        </div>
      </div>
    );
  }

  // No user selected
  if (!selectedUser?._id) {
    return (
      <div className="flex-1 grid place-items-center p-6 text-center">
        <p className="text-sm text-base-content/70">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sticky header for mobile */}
      <div className="sticky top-0 z-20 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
        <ChatHeader />
      </div>

      {/* Messages */}
      <div
        className="
          flex-1 overflow-y-auto
          px-2 sm:px-3 md:px-4
          py-2 sm:py-3 md:py-4
          space-y-3 sm:space-y-4
          [scrollbar-width:thin]
        "
      >
        {messages.map((message, idx) => {
          const isSelf = message.senderId === authUser?._id;

          return (
            <div
              key={message._id || idx}
              className={`chat ${isSelf ? "chat-end" : "chat-start"} break-words`}
            >
              <div className="chat-image avatar self-end">
                <div className="size-8 sm:size-10 rounded-full border">
                  <img
                    src={
                      isSelf
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-[10px] sm:text-xs opacity-60 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className="
                  chat-bubble flex flex-col gap-2
                  max-w-[82vw] xs:max-w-[78vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw]
                  whitespace-pre-wrap break-words
                "
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="w-full h-auto rounded-md max-h-72 sm:max-h-80 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {message.text && (
                  <p className="leading-relaxed text-sm sm:text-base">{message.text}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Sticky input, safe-area aware */}
      <div className="sticky bottom-[max(0px,env(safe-area-inset-bottom))] z-20 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
        <div className="px-2 sm:px-3 md:px-4 py-2">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
