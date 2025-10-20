// setupTests.js
global.fetch = require('jest-fetch-mock');

// jest.setup.js

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
