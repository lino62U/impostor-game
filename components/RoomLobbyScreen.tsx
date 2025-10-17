import React from 'react';
import { Room } from '../types';
import { UserGroupIcon, ArrowLeftOnRectangleIcon } from './icons';

interface RoomLobbyScreenProps {
  room: Room;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onPlayerReadyToggle: (playerId: string) => void;
}

const RoomLobbyScreen: React.FC<RoomLobbyScreenProps> = ({ room, onStartGame, onLeaveRoom, onPlayerReadyToggle }) => {
  const allReady = room.players.length >= 3 && room.players.every(p => p.isReady);

  const playerGridCols = `grid-cols-${Math.min(Math.ceil(room.settings.maxPlayers / 2), 6)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-5xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{room.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">Room Code: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{room.id}</span></p>
          </div>
          <button onClick={onLeaveRoom} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-red-500/80 hover:text-white transition-colors">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Leave
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Players ({room.players.length}/{room.settings.maxPlayers})</h2>
            <div className={`grid ${playerGridCols} gap-4`}>
              {room.players.map(player => (
                <div key={player.id} className="flex flex-col items-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-2">
                    {player.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-center truncate w-full text-slate-800 dark:text-slate-200">{player.name}</p>
                  <p className={`text-xs ${player.isHost ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>{player.isHost ? 'Host' : 'Player'}</p>
                  {player.isHost ? ( // Assuming host is the current user
                    <button
                      onClick={() => onPlayerReadyToggle(player.id)}
                      className={`mt-2 w-full text-center py-1 rounded-lg text-xs font-semibold transition-colors ${
                        player.isReady
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-cyan-500 text-white hover:bg-cyan-600'
                      }`}
                    >
                      {player.isReady ? 'Ready' : 'Ready Up'}
                    </button>
                  ) : (
                    <div className={`mt-2 w-full text-center py-1 rounded-full text-xs transition-colors ${player.isReady ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-600/50 dark:text-slate-400'}`}>
                      {player.isReady ? 'Ready' : 'Waiting...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Game Settings</h2>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Theme:</span> <span className="font-semibold text-slate-800 dark:text-white">{room.settings.theme.type === 'CUSTOM' ? room.settings.theme.value : room.settings.theme.value}</span></div>
              <div className="flex justify-between"><span>Impostors:</span> <span className="font-semibold text-slate-800 dark:text-white">{room.settings.impostorCount}</span></div>
              <div className="flex justify-between"><span>Players:</span> <span className="font-semibold text-slate-800 dark:text-white">{room.settings.maxPlayers}</span></div>
              <div className="flex justify-between"><span>Privacy:</span> <span className="font-semibold text-slate-800 dark:text-white">{room.settings.isPrivate ? 'Private' : 'Public'}</span></div>
            </div>

            <button
              onClick={onStartGame}
              disabled={!allReady}
              className="mt-8 w-full py-3 font-bold text-xl rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white transition-all transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100"
            >
              {allReady ? 'Start Game' : room.players.length < 3 ? 'Need 3+ players' : 'Waiting for ready...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobbyScreen;