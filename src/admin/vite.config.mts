import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    //optimizeDeps: {   force: true,exclude: ['.react-dom','node_modules/.cache','node_modules/.vite','.vite'] },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
