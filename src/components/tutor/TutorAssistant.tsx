/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TIMADIPhaseId } from '../../types/timadi';
import { TutorEngine } from '../../services/tutorEngine';
import { 
  X, 
  Send, 
  HelpCircle, 
  AlertTriangle, 
  BookMarked, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface TutorAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: TIMADIPhaseId;
  phaseName: string;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  timestamp: string;
}

export const TutorAssistant: React.FC<TutorAssistantProps> = ({
  isOpen,
  onClose,
  currentPhase,
  phaseName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: `Hello young Curie! I am Dr. Curie, your Intelligent Chemistry Lab Tutor. Right now we are focusing on "${phaseName}". How can I guide your inquiry today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'misconceptions' | 'reference'>('chat');

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsThinking(true);

    try {
      const reply = await TutorEngine.getTutorChatReply({
        studentMessage: textToSend,
        phaseName,
        contextSummary: `Grade 10 TI-MADI Boyle's Law lesson, current phase ${currentPhase}`,
      });

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: "Keep observing the relationship between pressure and volume! When volume decreases, gas particles collide more frequently with the container walls.",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const socraticQuestions = [
    "What is the Boyle's Law mathematical equation?",
    "Do gas molecules speed up when compressed?",
    "Why do scuba divers have to ascend slowly?",
    "What is the difference between P vs V and P vs 1/V graphs?",
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-white border-l border-slate-200 shadow-2xl flex flex-col no-print animate-in slide-in-from-right duration-200">
      
      {/* Tutor Header with Avatar */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/dr_curie_lab_avatar_1793261223466.jpg"
            alt="Dr. Curie Chemistry Mentor"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border-2 border-sky-400"
          />
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>Dr. Curie</span>
              <span className="text-[10px] text-sky-300 font-mono">ITS MENTOR</span>
            </div>
            <div className="text-[11px] text-slate-300">Grade 10 Chemistry Pedagogy</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Close tutor assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-medium bg-slate-50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-sky-600 text-sky-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Socratic Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('misconceptions')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'misconceptions'
              ? 'border-sky-600 text-sky-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Misconceptions</span>
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'reference'
              ? 'border-sky-600 text-sky-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-sky-600" />
          <span>Formulas</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'chat' && (
        <>
          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-600" />
                <span>Dr. Curie is evaluating your inquiry...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex flex-col gap-1.5">
            <div className="text-[10px] uppercase font-mono font-medium text-slate-400 px-1">
              Ask Dr. Curie:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {socraticQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] text-left bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about Boyle's law or your data..."
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}

      {activeTab === 'misconceptions' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Common Grade 10 Pitfalls</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Watch out for these frequent mistakes when constructing your scientific arguments!
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
            <div className="font-semibold text-red-600">❌ "Particles get smaller when compressed"</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              <strong>Correction:</strong> Gas atoms/molecules possess fixed sizes. Compression only reduces the empty space between them.
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
            <div className="font-semibold text-red-600">❌ "Particles speed up when you push the piston"</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              <strong>Correction:</strong> In Boyle's Law, temperature is held constant (298 K). Average particle kinetic energy remains unchanged! Pressure increases because shorter distances mean more frequent wall collisions.
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
            <div className="font-semibold text-red-600">❌ "Pressure and volume both increase together"</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              <strong>Correction:</strong> Boyle's Law is strictly an <em>inverse proportion</em> ($P \propto 1/V$). Halving the volume doubles the pressure.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'reference' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg space-y-2">
            <div className="font-bold text-sky-900 text-sm font-mono">Boyle's Law Formula</div>
            <div className="p-2.5 bg-white rounded border border-sky-100 text-center font-mono font-bold text-base text-sky-800">
              P₁ · V₁ = P₂ · V₂
            </div>
            <p className="text-[11px] text-sky-700">
              (For a fixed mass of gas at constant temperature)
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-800">Standard Conversion Units:</div>
            <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <li className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>1 atmosphere (atm)</span>
                <span className="font-bold">101.325 kPa</span>
              </li>
              <li className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>1 atmosphere (atm)</span>
                <span className="font-bold">760 mmHg (torr)</span>
              </li>
              <li className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>1 Liter (L)</span>
                <span className="font-bold">1000 mL (cm³)</span>
              </li>
              <li className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>Constant Temperature</span>
                <span className="font-bold">298.15 K (25°C)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
