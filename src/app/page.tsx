'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Dialog, DialogContent, DialogTitle  } from "@/components/ui/dialog";

export default function Home() {
  // --- TicTacToe Component ---
  function TicTacToe() {
    const emptyBoard = Array(9).fill("");
    const [board, setBoard] = useState(emptyBoard);
    const [isX, setIsX] = useState(true);
    const [winner, setWinner] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState({ X: 0, O: 0, Draw: 0 });
    const [showConfetti, setShowConfetti] = useState(false);
    const [open, setOpen] = useState(false);

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    function checkWinner(newBoard: string[]) {
      for (let line of lines) {
        const [a, b, c] = line;
        if (
          newBoard[a] &&
          newBoard[a] === newBoard[b] &&
          newBoard[a] === newBoard[c]
        ) {
          return newBoard[a];
        }
      }
      return newBoard.every((cell) => cell) ? "Draw" : "";
    }

    function handleClick(idx: number) {
      if (board[idx] || winner) return;
      const newBoard = board.slice();
      newBoard[idx] = isX ? "X" : "O";
      const result = checkWinner(newBoard);
      setBoard(newBoard);
      setIsX(!isX);
      if (result) {
        setWinner(result);
        setGameOver(true);
        setScore((prev) => {
          if (result === "Draw") return { ...prev, Draw: prev.Draw + 1 };
          if (result === "X") return { ...prev, X: prev.X + 1 };
          if (result === "O") return { ...prev, O: prev.O + 1 };
          return prev;
        });
      }
    }

    function restartGame() {
      setBoard(emptyBoard);
      setIsX(true);
      setWinner("");
      setGameOver(false);
      setOpen(false);
    }

    function resetAll() {
      setScore({ X: 0, O: 0, Draw: 0 });
      restartGame();
    }

    useEffect(() => {
      if (winner && winner !== "Draw") {
        setShowConfetti(true);
        const timeout = setTimeout(() => setShowConfetti(false), 2500);
        return () => clearTimeout(timeout);
      } else {
        setShowConfetti(false);
      }
    }, [winner]);

    useEffect(() => {
      if (gameOver) setOpen(true);
    }, [gameOver]);

    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton={false} className="flex flex-col items-center gap-4">
            <DialogTitle className="text-2xl font-bold">Congratulations!</DialogTitle>
            {winner && (
              <div className={`text-2xl font-bold ${winner === "X" ? "text-red-600" : winner === "O" ? "text-blue-600" : "text-green-600 dark:text-green-400"} text-center w-full`}> 
                {winner === "Draw"
                  ? "It's a draw!"
                  : winner === "X"
                  ? "Player 1 (X) wins!"
                  : "Player 2 (O) wins!"}
              </div>
            )}
            <button
              className="mt-1 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold hover:from-blue-700 hover:to-red-700 transition shadow-lg"
              onClick={restartGame}
            >
              Play Again!
            </button>
          </DialogContent>
        </Dialog>
        <div className="relative flex flex-col items-center gap-6 p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-2xl min-w-[320px] max-w-[360px] max-h-[540px] backdrop-blur-md">
          {showConfetti && (
            <Confetti
              width={typeof window !== "undefined" ? window.innerWidth : 300}
              height={typeof window !== "undefined" ? window.innerHeight : 300}
              numberOfPieces={250}
              recycle={false}
              className="fixed top-0 left-0 z-50 pointer-events-none"
            />
          )}
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-zinc-900 dark:text-zinc-100 drop-shadow-lg">Tic-Tac-Toe</h2>
          {/* Scoreboard */}
          <div className="flex justify-center gap-8 w-full mb-2">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-red-600">X</span>
              <span className="text-2xl font-mono font-bold drop-shadow text-zinc-900 dark:text-zinc-100">{score.X}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-blue-600">O</span>
              <span className="text-2xl font-mono font-bold drop-shadow text-zinc-900 dark:text-zinc-100">{score.O}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-zinc-500">Draw</span>
              <span className="text-2xl font-mono font-bold drop-shadow text-zinc-900 dark:text-zinc-100">{score.Draw}</span>
            </div>
          </div>
          <button
            className="mb-2 px-4 py-1 rounded-lg bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-100 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition shadow"
            onClick={resetAll}
          >
            Reset All
          </button>
          {/* Board */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className={`w-20 h-20 text-3xl font-extrabold flex items-center justify-center border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition disabled:opacity-50 shadow ${cell === "X" ? "text-red-600" : cell === "O" ? "text-blue-600" : ""}`}
                onClick={() => handleClick(idx)}
                disabled={!!cell || gameOver}
              >
                {cell}
              </button>
            ))}
          </div>
          {!winner && (
            <div className={`text-base mt-2 font-bold ${isX ? "text-red-600" : "text-blue-600"} drop-shadow-sm`}>
              {isX ? "Player 1 (X)'s turn" : "Player 2 (O)'s turn"}
            </div>
          )}
        </div>
      </>
    );
  }
  // --- End TicTacToe Component ---
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-900 dark:to-zinc-800">
      <main className="flex-1 flex items-center justify-center">
        <TicTacToe />
      </main>
      <footer className="w-full py-6 px-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 shadow-inner mt-8">
        <span className="font-semibold text-zinc-700 dark:text-zinc-200 text-sm">Made by <a href="https://aeg-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-blue-600 transition">Aithan Gimenez</a></span>
        <div className="flex gap-4">
          <a href="https://aeg-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-600 transition" title="Developer Portfolio">Portfolio</a>
          <a href="https://aithan-gimenez.my.canva.site/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-600 transition" title="Freelance Portfolio">Freelance</a>
          <a href="https://github.com/AEG14" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-600 transition" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline align-text-bottom"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.38.202 2.398.1 2.652.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg></a>
          <a href="https://www.linkedin.com/in/aithan-eulysse-gimenez-0113ba1a3" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-600 transition" title="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 inline align-text-bottom"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.043 0 3.604 2.004 3.604 4.609v5.587z"/></svg></a>
        </div>
      </footer>
    </div>
  );
}
