import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Sprout, ArrowRight } from 'lucide-react';
import { Modal3D } from './Modal3D';
import { Product, Market, User as UserType } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  markets: Market[];
  farmers: UserType[];
  onOpenProductDetail: (product: Product) => void;
  onSelectMarket: (marketId: number) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedProducts?: Product[];
  suggestedMarket?: Market;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  markets,
  farmers,
  onOpenProductDetail,
  onSelectMarket
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your MarketLink eGreen Assistant. Ask me about market hours, which farmers have sourdough or heirloom tomatoes, or when to pick up your weekly basket!'
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let matchedProds: Product[] = [];
      let matchedMarket: Market | undefined;

      if (q.includes('tomato') || q.includes('vegetable') || q.includes('carrot') || q.includes('produce')) {
        matchedProds = products.filter(p => p.category_id === 1 || p.name.toLowerCase().includes('tomato') || p.name.toLowerCase().includes('carrot'));
        reply = `I found fresh heirloom harvest from Meadowbrook Organics! Sarah Jenkins harvests her Brandywine tomatoes and sweet carrots at dawn before market day.`;
      } else if (q.includes('honey') || q.includes('bread') || q.includes('sourdough') || q.includes('bake')) {
        matchedProds = products.filter(p => p.category_id === 3 || p.category_id === 6 || p.name.toLowerCase().includes('honey') || p.name.toLowerCase().includes('sourdough'));
        reply = `Marcus Vance at Golden Haven Apiaries has raw spring wildflower honey and 36-hour cold fermented sourdough boules ready for pre-order.`;
      } else if (q.includes('market') || q.includes('time') || q.includes('day') || q.includes('saturday') || q.includes('hours')) {
        matchedMarket = markets[0];
        reply = `Greenfield Community Market operates Wednesdays and Saturdays from 07:30 AM to 01:30 PM. Valley View Riverside Pavilion is open Friday and Sunday. You can reserve items in advance to guarantee stock!`;
      } else if (q.includes('pay') || q.includes('cost') || q.includes('card')) {
        reply = `Pre-orders on MarketLink require zero payment card online! Simply reserve your basket, inspect the produce in person at the stall, and pay the farmer directly with cash, card, or QR code.`;
      } else {
        matchedProds = products.slice(0, 2);
        reply = `Here is what is currently trending across local regional markets! Feel free to ask about specific produce, farmer profiles, or pickup schedules.`;
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: reply,
        suggestedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        suggestedMarket: matchedMarket
      };

      setMessages(prev => [...prev, botMsg]);
      setThinking(false);
    }, 600);
  };

  const sampleQueries = [
    'Where can I find heirloom tomatoes?',
    'What days is Greenfield Market open?',
    'Who bakes artisan sourdough bread?',
    'How does pickup pre-ordering work?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <Modal3D>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[560px]">
        {/* Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#194D26] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">eGreen Assistant</h3>
              <p className="text-[11px] text-stone-500">Market intelligence & produce locator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[#194D26] text-white flex items-center justify-center shrink-0 text-[10px]">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#194D26] text-white rounded-br-xs'
                      : 'bg-stone-100 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>

                {/* Suggested Products Card */}
                {m.suggestedProducts && (
                  <div className="space-y-1.5 pt-1">
                    {m.suggestedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onOpenProductDetail(p);
                        }}
                        className="p-2 bg-white rounded-xl border border-stone-200 hover:border-[#194D26] cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-stone-900 truncate block">{p.name}</span>
                            <span className="text-[10px] text-stone-500">{p.stall_name}</span>
                          </div>
                        </div>
                        <span className="font-mono tabular-nums font-bold text-[#194D26] shrink-0">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Market */}
                {m.suggestedMarket && (
                  <div
                    onClick={() => {
                      onClose();
                      onSelectMarket(m.suggestedMarket!.id);
                    }}
                    className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[#194D26] font-medium cursor-pointer flex items-center justify-between"
                  >
                    <span>{m.suggestedMarket.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-2 text-stone-400 text-xs pl-8">
              <span className="inline-block animate-pulse">Checking farm inventories...</span>
            </div>
          )}
        </div>

        {/* Quick query suggestion chips */}
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 flex gap-1.5 overflow-x-auto">
          {sampleQueries.map(sq => (
            <button
              key={sq}
              type="button"
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] text-stone-600 hover:text-stone-900 whitespace-nowrap"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-stone-200 bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about markets, farmers, or fresh produce..."
            className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#194D26]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2 bg-[#194D26] text-white rounded-lg hover:bg-[#143e1f]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      </Modal3D>
    </div>
  );
};
