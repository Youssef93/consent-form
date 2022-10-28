module.exports = {
  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  collectCoverage: false,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  }
}