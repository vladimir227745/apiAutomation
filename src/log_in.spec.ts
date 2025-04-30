import { User } from '../helper/interface';
import { deleteFunction, getUser, login, login2, signUp } from '../helper/user';
import * as supertest from 'supertest';
const request = supertest('http://localhost:8001/api/v1');

describe('USER SIGNUP AND LOGIN', () => {
  const user: User = getUser('admin');
  let cookie;
  describe('POSITIVE TESTING', () => {
    // Async/Await + try and catch
    it('should sign up , login and delete the user', async () => {
      try {
        //Make the POST request
        const res = (Response = await signUp(user));
        expect(res.statusCode).toBe(201);
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.status).toEqual('success');

        //login user
        const loginRes = await login(user);
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.status).toBe('success');
        cookie = loginRes.headers['set-cookie'][0].split(';')[0];

        //delete user
        const deleteRes = await deleteFunction(cookie);
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe('User deleted successfully');

        //login
        const loginAfterDeletion = await login2(user);
        expect(loginAfterDeletion.statusCode).toBe(401);
        expect(loginAfterDeletion.body.message).toBe(
          'Incorrect email or password'
        );
      } catch (error) {
        console.error('Error during signup:', error);
        throw error; // Rethrow the error to fail the test
      }
    });
  });
});
