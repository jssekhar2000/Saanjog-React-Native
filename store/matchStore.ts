import { create } from 'zustand';
import { Match, User } from '../types/user';

interface MatchState {
  matches: Match[];
  currentMatch: User | null;
  matchQueue: User[];
  likedProfiles: string[];
  passedProfiles: string[];
  mutualMatches: Match[];
  isLoading: boolean;
  setMatches: (matches: Match[]) => void;
  setCurrentMatch: (match: User | null) => void;
  setMatchQueue: (queue: User[]) => void;
  likeProfile: (userId: string) => void;
  passProfile: (userId: string) => void;
  addMutualMatch: (match: Match) => void;
  loadNextMatch: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  currentMatch: null,
  matchQueue: [],
  likedProfiles: [],
  passedProfiles: [],
  mutualMatches: [],
  isLoading: false,

  setMatches: (matches) => set({ matches }),
  
  setCurrentMatch: (match) => set({ currentMatch: match }),
  
  setMatchQueue: (queue) => {
    set({ 
      matchQueue: queue,
      currentMatch: queue.length > 0 ? queue[0] : null
    });
  },

  likeProfile: (userId) => {
    const { likedProfiles } = get();
    set({ 
      likedProfiles: [...likedProfiles, userId]
    });
  },

  passProfile: (userId) => {
    const { passedProfiles } = get();
    set({ 
      passedProfiles: [...passedProfiles, userId]
    });
  },

  addMutualMatch: (match) => {
    const { mutualMatches } = get();
    set({ 
      mutualMatches: [...mutualMatches, match]
    });
  },

  loadNextMatch: () => {
    const { matchQueue } = get();
    if (matchQueue.length > 1) {
      const nextQueue = matchQueue.slice(1);
      set({
        matchQueue: nextQueue,
        currentMatch: nextQueue[0] || null
      });
    } else {
      set({
        matchQueue: [],
        currentMatch: null
      });
    }
  },
}));