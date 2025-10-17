import React from 'react';
import { Room } from '../types';
import { UserGroupIcon } from './icons';

interface GameScreenProps {
  room: Room;
  onPlayAgain: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ room, onPlayAgain }) => {
  // We'll assume the user is the first player in the list for this simulation
  const me = room.players[0];

  const isImpostor = me.role === 'IMPOSTOR';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl text-center">
        
        <div className={`mb-8 p-8 rounded-2xl border-2 transition-colors ${isImpostor ? 'border-red-500 bg-red-100 dark:bg-red-900/30' : 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30'} shadow-2xl ${isImpostor ? 'shadow-red-500/20' : 'shadow-cyan-500/20'}`}>
          <p className="text-2xl text-slate-600 dark:text-slate-300">Your Role is</p>
          <h1 className={`text-7xl font-extrabold my-2 bg-clip-text text-transparent ${isImpostor ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-400 to-teal-400'}`}>
            {me.role}
          </h1>
          <div className="h-1 w-24 mx-auto bg-slate-300 dark:bg-slate-600 my-6"></div>
          {isImpostor ? (
            <p className="text-xl text-slate-700 dark:text-slate-300">
              Blend in. Don't get caught. The word is related to <span className="font-bold text-slate-900 dark:text-white">{room.settings.theme.value}</span>.
            </p>
          ) : (
            <>
              <p className="text-xl text-slate-700 dark:text-slate-300">The word is:</p>
              <p className="text-5xl font-bold text-slate-900 dark:text-white my-2">{me.word}</p>
            </>
          )}
        </div>

        <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-center gap-2">
            <UserGroupIcon className="w-7 h-7" />
            Players in Game
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {room.players.map(player => (
              <div key={player.id} className="p-3 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 dark:from-slate-600 to-slate-300 dark:to-slate-500 flex-shrink-0"></div>
                <span className="font-semibold truncate text-slate-800 dark:text-slate-200">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onPlayAgain} className="mt-8 px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-purple-500 dark:hover:bg-purple-600 hover:text-white transition-colors transform hover:scale-105">
          Play Again
        </button>

      </div>
    </div>
  );
};

export default GameScreen;