import { saveToStorage, getFromStorage } from './storage';

describe('localStorage helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        store: {},
        setItem: jest.fn(function (key, value) {
          this.store[key] = value;
        }),
        getItem: jest.fn(function (key) {
          return this.store[key] || null;
        }),
        clear: jest.fn(function () {
          this.store = {};
        }),
      },
      writable: true,
    });
  });

  test('saveToStorage deve salvar um valor no localStorage', () => {
    saveToStorage('user', { name: 'Ana' });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ name: 'Ana' })
    );
  });

  test('getFromStorage deve retornar o valor correto do localStorage', () => {
    localStorage.setItem('token', JSON.stringify('abc123'));

    const result = getFromStorage('token');

    expect(result).toBe('abc123');
  });

  test('getFromStorage deve retornar null quando a chave não existe', () => {
    expect(getFromStorage('inexistente')).toBeNull();
  });

  test('saveToStorage deve logar erro se JSON.stringify falhar', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const circular = {};
    circular.self = circular;

    saveToStorage('test', circular);

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('getFromStorage deve logar erro se JSON.parse falhar', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    localStorage.setItem('x', 'INVALID_JSON');

    const result = getFromStorage('x');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
