export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#1E293B] text-[#F8FAFC] border border-[#2D3B55]'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
