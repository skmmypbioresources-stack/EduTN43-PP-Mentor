import { registerSW } from 'virtual:pwa-register';

export const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    const shouldUpdate = window.confirm(
      'A new version of PP Mentor is available.\n\nClick OK to update now.'
    );

    if (shouldUpdate) {
      updateSW(true);
    }
  },

  onOfflineReady() {
    console.log('PP Mentor is ready to work offline.');
  },
});