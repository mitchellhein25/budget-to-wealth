 import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {  transform: {
    '^.+\\.tsx?$': 'babel-jest', 
  },
  testEnvironment: 'jsdom', 
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],moduleNameMapper: {
    '^@auth0/nextjs-auth0/server$': '<rootDir>/tests/mocks/nextjs-auth0-server.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}
export default createJestConfig(config)
