module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ]
};
