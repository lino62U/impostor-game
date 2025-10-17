import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import RoomLobbyScreen from './components/RoomLobbyScreen';
import GameScreen from './components/GameScreen';
import { Player, Room, RoomSettings } from './types';
import { FOOTBALL_PLAYERS } from './constants';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'home' | 'lobby' | 'game'>('home');
  const [room, setRoom] = useState<Room | null>(null);

  // Simulate other players joining the lobby
  useEffect(() => {
    if (view === 'lobby' && room && room.players.length < room.settings.maxPlayers) {
      const interval = setInterval(() => {
        setRoom(prevRoom => {
          if (!prevRoom || prevRoom.players.length >= prevRoom.settings.maxPlayers) {
            clearInterval(interval);
            return prevRoom;
          }
          const newPlayer: Player = {
            id: `P-${Date.now()}`,
            name: `Player ${prevRoom.players.length + 1}`,
            isHost: false,
            isReady: true, // Simulated players join as ready
            role: null,
            word: null,
          };
          
          return { ...prevRoom, players: [...prevRoom.players, newPlayer] };
        });
      }, 1500); // New player joins every 1.5 seconds

      return () => clearInterval(interval);
    }
  }, [view, room]);

  const handleCreateRoom = (settings: RoomSettings) => {
    const host: Player = {
      id: 'P-HOST',
      name: 'Player 1',
      isHost: true,
      isReady: false,
      role: null,
      word: null,
    };

    const newRoom: Room = {
      id: `RM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name: `My Game Room`,
      players: [host],
      settings,
      gamePhase: 'LOBBY',
    };
    setRoom(newRoom);
    setView('lobby');
  };
  
  // This is a simulation, so joining a mock room is the same as creating one
  const handleJoinRoom = () => {
     handleCreateRoom({
        maxPlayers: 8,
        impostorCount: 1,
        isPrivate: false,
        theme: { type: 'PREDEFINED', value: 'Football Players' }
    });
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    setView('home');
  };

  const handlePlayerReadyToggle = useCallback((playerId: string) => {
    setRoom(prevRoom => {
        if (!prevRoom) return null;

        const updatedPlayers = prevRoom.players.map(p => 
            p.id === playerId ? { ...p, isReady: !p.isReady } : p
        );

        return { ...prevRoom, players: updatedPlayers };
    });
  }, []);

  const handleStartGame = useCallback(() => {
    if (!room) return;

    let word = 'Error';
    if (room.settings.theme.type === 'CUSTOM') {
        word = room.settings.theme.value;
    } else {
        word = FOOTBALL_PLAYERS[Math.floor(Math.random() * FOOTBALL_PLAYERS.length)];
    }

    const players = [...room.players];
    // Shuffle players to randomize impostor assignment
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }

    // FIX: Explicitly type `updatedPlayers` as `Player[]` to ensure type compatibility.
    const updatedPlayers: Player[] = players.map((player, index) => {
      if (index < room.settings.impostorCount) {
        return { ...player, role: 'IMPOSTOR', word: null };
      }
      return { ...player, role: 'CREWMATE', word: word };
    });

    // Un-shuffle to put the host back at the start for the simulation
    updatedPlayers.sort((a, b) => (a.isHost ? -1 : b.isHost ? 1 : 0));

    setRoom({
      ...room,
      players: updatedPlayers,
      gamePhase: 'IN_GAME',
    });
    setView('game');
  }, [room]);


  const renderContent = () => {
    switch (view) {
      case 'lobby':
        return room && <RoomLobbyScreen room={room} onStartGame={handleStartGame} onLeaveRoom={handleLeaveRoom} onPlayerReadyToggle={handlePlayerReadyToggle} />;
      case 'game':
        return room && <GameScreen room={room} onPlayAgain={handleLeaveRoom}/>;
      case 'home':
      default:
        return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
    }
  };

  return (
    <main className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white min-h-screen font-sans transition-colors duration-300">
        <ThemeToggle />
        {renderContent()}
    </main>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App;