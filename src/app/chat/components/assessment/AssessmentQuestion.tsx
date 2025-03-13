"use client";

import React, { useState } from "react";

interface AssessmentQuestionProps {
  step: number;
  totalSteps: number;
  question: {
    question: string;
    options: string[];
  };
  onSubmit: (answer: string) => Promise<void>;
}

export default function AssessmentQuestion({ 
  step, 
  totalSteps, 
  question, 
  onSubmit 
}: AssessmentQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  try {
    const answer = [
      ...selectedOptions,
      ...(customInput.trim() ? [`Custom: ${customInput}`] : [])
    ].join("; ");
    await onSubmit(answer);
    setSelectedOptions([]);
    setCustomInput("");
  } catch (error) {
    console.error('Error submitting answer:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1E293B] rounded-lg p-6 shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Health Assessment</h3>
        <span className="text-sm text-gray-400">Question {step} of {totalSteps}</span>
      </div>
      
      <div className="mb-6">
        <p className="text-white mb-4">{question.question}</p>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label key={index} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionToggle(option)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="w-full px-3 py-2 bg-[#0F172A] text-white rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="Enter any additional information..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || (selectedOptions.length === 0 && !customInput.trim())}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors relative"
      >
        {isSubmitting ? (
          <>
            <span className="opacity-0">Next Question</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
        ) : (
          'Next Question'
        )}
      </button>
    </div>
  );
}
