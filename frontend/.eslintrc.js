module.exports = {
    env: {
        node: true  // 允许使用NodeJS的require()
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module'
    },
    rules: {
        complexity: ["error", 10]   // 圈复杂度，高于10即报错
    }
};
