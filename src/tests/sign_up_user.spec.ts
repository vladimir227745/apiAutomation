import * as supertest from 'supertest';

const request = supertest('http://localhost:8001/api/v1');

describe('USER SIGN UP', () => {
  describe('POSITIVE TESTING', () => {
    it('should sign up a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john13@example.com',
        password: 'mypassword123',
        passwordConfirm: 'mypassword123',
      };
      console.log(userData);
      const res = await request.post('/users/signup').send(userData);
      console.log(res.body);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
    });
  });

  describe('NEGATIVE TESTING', () => {
    it('should get an error when user is not in the body', async () => {
      const userDataNoName = {
        email: 'john7@example.com',
        password: 'mypassword123',
        passwordConfirm: 'mypassword123',
      };
      console.log(userDataNoName);
      const res = await request.post('/users/signup').send(userDataNoName);
      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Missing required fields: name');
    });

    it('should get an error when email is not in the body', async () => {
      const userDataNoEmail = {
        name: 'John Doe',
        password: 'mypassword123',
        passwordConfirm: 'mypassword123',
      };
      console.log(userDataNoEmail);
      const res = await request.post('/users/signup').send(userDataNoEmail);
      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Missing required fields: email');
    });

    it(`should get an error when emails don't match`, async () => {
      const differentPasswords = {
        name: 'John Doe',
        email: 'john7@example.com',
        password: 'mypassword123',
        passwordConfirm: 'password123',
      };
      console.log(differentPasswords);
      const res = await request.post('/users/signup').send(differentPasswords);
      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe(
        'User validation failed: passwordConfirm: Passwords are not the same!'
      );
    });
  });
});
