import create from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  resetUser: () => set({ user: null, profile: null }),
}));

export default useUserStore;
