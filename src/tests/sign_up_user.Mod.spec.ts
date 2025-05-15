// Import required modules
import { faker } from '@faker-js/faker';
import { createUser, signUp, deleteUser } from '../../helper/user'; // Import helper functions
import { Response } from 'superagent';
import { User } from '../../helper/interface';

// Define test suite
describe('USER SIGN UP - NEGATIVE TESTING', () => {
  let userData: Partial<User>;

  // Generate user data before each test
  beforeEach(() => {
    userData = createUser(); // Use helper function to generate user data
    console.log('\\n🔹 Generated User Data:', userData);
  });

  afterEach(async () => {
    await deleteUser(userData.email); // Cleanup: Remove created test users
  });

  // ✅ 1. Passing empty body
  it('should return 400 if required fields are missing', async () => {
    const res = await signUp({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain(
      'Missing required fields: name, email, password, passwordConfirm'
    );
  });

  // ✅ 2. Missing name field
  it('should return 400 if the name field is missing', async () => {
    const res = await signUp({
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name');
  });

  // ✅ 3. Missing email field
  it('should return 400 if the email field is missing', async () => {
    const res = await signUp({
      name: userData.name,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields: email');
  });

  // ✅ 4. Missing password field
  it('should return 400 if the password field is missing', async () => {
    const res = await signUp({
      name: userData.name,
      email: userData.email,
      passwordConfirm: userData.passwordConfirm,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields: password');
  });

  // ✅ 5. Missing passwordConfirm field
  it('should return 400 if the passwordConfirm field is missing', async () => {
    const res = await signUp({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields: passwordConfirm');
  });

  // ✅ 6. Invalid email format
  it('should return 400 if the email format is invalid', async () => {
    const res = await signUp({
      name: userData.name,
      email: 'invalid-email',
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Please provide a valid email');
  });

  // ✅ 7. Password and passwordConfirm mismatch
  it('should return 400 if password and passwordConfirm do not match', async () => {
    const res = await signUp({
      name: userData.name,
      email: userData.email,
      password: 'Test@12345',
      passwordConfirm: 'MismatchPassword',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      'User validation failed: passwordConfirm: Passwords are not the same!'
    );
  });

  // ✅ 8. Password too long
  it('should return 400 if the password is too long', async () => {
    const longPassword = 'a'.repeat(101);
    const res = await signUp({
      name: userData.name,
      email: userData.email,
      password: longPassword,
      passwordConfirm: longPassword,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Password longer then 30 characters');
  });

  // ✅ 9. Attempting duplicate email registration
  it('should return 400 when trying to create a user with an already registered email', async () => {
    await signUp(userData); // First signup

    const duplicateRes = await signUp(userData); // Second signup attempt
    expect(duplicateRes.statusCode).toBe(400);
    expect(duplicateRes.body.message).toBe(
      'This email is already in use. Please use another email.'
    );
  });
});
