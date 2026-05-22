/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          types: ["jest", "node"],
          esModuleInterop: true,
          moduleResolution: "node",
          jsx: "react-jsx",
          target: "ESNext",
          module: "CommonJS",
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};
