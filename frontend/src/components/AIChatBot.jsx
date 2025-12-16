import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "@/utils/axiosClient";
import { Send, Bot, User } from "lucide-react";

function AIChatBot({ problem }) {
    const [messages, setMessages] = useState([
        { role: "model", parts: [{ text: "Hi, How are you" }] },
        { role: "user", parts: [{ text: "I am Good" }] }
    ]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", parts: [{ text: data.message }] }
        ]);
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: messages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [{ text: response.data.message }]
                }
            ]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [
                        {
                            text: "Sorry, I encountered an error. Please try again."
                        }
                    ]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">
                            AI Assistant
                        </h3>
                        <p className="text-xs text-gray-500">
                            Ask questions about this problem
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                                ? "bg-primary text-white rounded-tr-none"
                                : "bg-white border border-gray-200 rounded-tl-none"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {msg.role === "user" ? (
                                    <User size={12} className="text-white/80" />
                                ) : (
                                    <Bot size={12} className="text-gray-500" />
                                )}
                                <span
                                    className={`text-xs font-medium ${msg.role === "user"
                                        ? "text-white/80"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {msg.role === "user"
                                        ? "You"
                                        : "AI Assistant"}
                                </span>
                            </div>
                            <div
                                className={`text-sm ${msg.role === "user"
                                    ? "text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <Bot size={12} className="text-gray-500" />
                                <span className="text-xs font-medium text-gray-500">
                                    AI Assistant
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border-t border-gray-200 bg-white p-4"
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <input
                            placeholder="Ask a question about this problem..."
                            className={`w-full border ${errors.message
                                ? "border-red-300"
                                : "border-gray-300"
                                } rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary`}
                            {...register("message", {
                                required: true,
                                minLength: 2
                            })}
                            disabled={loading}
                        />
                        {errors.message && (
                            <span className="text-red-600 text-xs ml-4 mt-1">
                                Please enter a message (minimum 2 characters)
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading || errors.message}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    The AI can help explain concepts, debug code, or provide
                    hints
                </p>
            </form>
        </div>
    );
}

export default AIChatBot;
