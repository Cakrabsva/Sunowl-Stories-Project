const { Password } = require('../helpers/Password');

describe('Password Helper Functions', () => {
  const plainPassword = 'Sunowl1811';
  let hashedPassword;

  test('hashPassword should return a hashed string', () => {
    hashedPassword = Password.hashPassword(plainPassword);
    
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toBe(plainPassword); 
    expect(hashedPassword.length).toBeGreaterThan(20);
  });

  test('comparePassword should return true for matching password', () => {
    const result = Password.comparePassword(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  test('comparePassword should return false for incorrect password', () => {
    const wrongPassword = 'Wrong123';
    const result = Password.comparePassword(wrongPassword, hashedPassword);
    expect(result).toBe(false);
  });
});