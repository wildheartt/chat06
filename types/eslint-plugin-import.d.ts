declare module 'eslint-plugin-import' {
  const flatConfigs: {
    recommended: import('eslint').Linter.Config;
  };
  export { flatConfigs };
}
