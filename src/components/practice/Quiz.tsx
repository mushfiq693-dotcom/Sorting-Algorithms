"use client";

import React, { useState } from "react";
import { QUIZZES, QuizTopic, QuizQuestion } from "@/data/quizzes";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Award,
  Check,
  Zap,
} from "lucide-react";

interface QuizProps {
  topicId: string;
  onComplete?: (score: number, total: number) => void;
}

export function Quiz({ topicId, onComplete }: QuizProps) {
  const quizData: QuizTopic | undefined = QUIZZES[topicId];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answersHistory, setAnswersHistory] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  if (!quizData || !quizData.questions.length) {
    return null;
  }

  const currentQ: QuizQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    setAnswersHistory((prev) => ({
      ...prev,
      [currentQuestionIndex]: { selected: index, isCorrect },
    }));

    if (isLastQuestion && isCorrect && newScore === quizData.questions.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsQuizCompleted(true);
      if (onComplete) onComplete(score, quizData.questions.length);
      if (score >= Math.ceil(quizData.questions.length * 0.75)) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersHistory({});
    setIsQuizCompleted(false);
  };

  return (
    <div className="my-8 rounded-2xl border border-border/80 bg-[#0c121e]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {quizData.title}
            </h3>
            <p className="text-xs text-muted-foreground">{quizData.description}</p>
          </div>
        </div>

        {!isQuizCompleted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-secondary text-cyan-400 border border-border/60">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
          </div>
        )}
      </div>

      {/* Quiz Body */}
      {!isQuizCompleted ? (
        <div className="space-y-5 animate-in fade-in">
          {/* Question Text */}
          <div className="space-y-2">
            <h4 className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
              {currentQ.question}
            </h4>

            {currentQ.codeSnippet && (
              <pre className="p-3 rounded-xl bg-black/60 border border-border/50 font-mono text-xs text-cyan-200 overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQ.correctIndex;

              let btnStyle = "border-border/60 bg-card/60 text-foreground/90 hover:bg-card hover:border-cyan-400/50";
              if (isAnswered) {
                if (isCorrectOption) {
                  btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-md shadow-emerald-500/10";
                } else if (isSelected && !isCorrectOption) {
                  btnStyle = "border-rose-500 bg-rose-500/15 text-rose-200 shadow-md shadow-rose-500/10";
                } else {
                  btnStyle = "border-border/40 bg-card/30 text-muted-foreground opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-secondary/80 border border-border/60 flex items-center justify-center font-mono text-xs text-muted-foreground font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isCorrectOption && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Feedback */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border leading-relaxed animate-in fade-in ${
                selectedOption === currentQ.correctIndex
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {selectedOption === currentQ.correctIndex ? (
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider block mb-1">
                    {selectedOption === currentQ.correctIndex ? "Correct Answer!" : "Why that's incorrect:"}
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <span>{isLastQuestion ? "View Final Score" : "Next Question"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completion Summary */
        <div className="text-center py-6 space-y-5 animate-in fade-in">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-white">Quiz Completed!</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              You scored <strong className="text-cyan-400">{score}</strong> out of{" "}
              <strong>{quizData.questions.length}</strong> (
              {Math.round((score / quizData.questions.length) * 100)}%)
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
