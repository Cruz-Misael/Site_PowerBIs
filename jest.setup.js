require('@testing-library/jest-dom');
import 'whatwg-fetch'; // ou 'cross-fetch'

// Adicione isso se ainda não tiver
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Para o aviso do punycode
jest.mock('punycode', () => ({
  encode: jest.fn(),
  decode: jest.fn()
}));

// Mock do alert
global.alert = jest.fn();