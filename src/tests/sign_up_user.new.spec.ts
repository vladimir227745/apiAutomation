import * as supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { Response } from 'supertest';

const request = supertest('http://localhost:8001/api/v1');

interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
describe('USER SIGN UP', () => {
  describe('POSITIVE TESTING with async/await', () => {
    it('should sign up a new user', async () => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(), //remember this email should be unique
        password: 'test1234',
        passwordConfirm: 'test1234',
      };
      console.log(userData);
      try {
        //Make the POST request
        const res: Response = await request
          .post('/users/signup')
          .send(userData)
          .expect(201);
        //Log the response
        console.log(res.body);
        //Validate response body
        expect(res.body.status).toBe('success');
        expect(res.body.data.user.name).toBe(userData.name);
        expect(typeof res.body.data.user.name).toBe('string');
        expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
        expect(typeof res.body.data.user.email).toBe('string');
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe('string');

        // Additional checks for user object
        expect(res.body.data.user).toHaveProperty('_id');
        expect(res.body.data.user).not.toHaveProperty('password');
      } catch (error) {
        console.error('Error during signup:', error);
        throw error; // Rethrow the error to fail the test
      }
    });
  });

  describe('POSITIVE TESTING with .then', () => {
    it('should sign up a new user', async () => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(), //remember this email should be unique
        password: 'test1234',
        passwordConfirm: 'test1234',
      };
      console.log(userData);
      //Make the POST request using .then
      return request
        .post('/users/signup')
        .send(userData)
        .expect(201)
        .then((res: Response) => {
          expect(res.body.status).toBe('success');
          expect(res.body.data.user.name).toBe(userData.name);
          expect(typeof res.body.data.user.name).toBe('string');
          expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
          expect(typeof res.body.data.user.email).toBe('string');
          expect(res.body.token).toBeDefined();
          expect(typeof res.body.token).toBe('string');

          // Additional checks for user object
          expect(res.body.data.user).toHaveProperty('_id');
          expect(res.body.data.user).not.toHaveProperty('password');
        })
        .catch((error) => {
          console.error('Error during signup:', error);
          throw error; // Rethrow the error to fail the test
        });
    });
  });

  describe('POSITIVE TESTING with .end() and done()', () => {
    it('should sign up a new user', (done) => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(), //remember this email should be unique
        password: 'test1234',
        passwordConfirm: 'test1234',
      };
      console.log(userData);
      //Make the POST request using .then
      request
        .post('/users/signup')
        .send(userData)
        .expect(201) //res.body
        .end((err: Error | null, res: Response) => {
          if (err) {
            console.error('Error during signup:', err);
            return done(err);
          }
          try {
            expect(res.body.status).toBe('success');
            expect(res.body.data.user.name).toBe(userData.name);
            expect(typeof res.body.data.user.name).toBe('string');
            expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
            expect(typeof res.body.data.user.email).toBe('string');
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');

            // Additional checks for user object
            expect(res.body.data.user).toHaveProperty('_id');
            expect(res.body.data.user).not.toHaveProperty('password');
            done(); // Call done() to indicate the test is complete
          } catch (err) {
            console.error('Error during signup:', err);
            done(err); // Rethrow the error to fail the test
          }
        });
    });
  });

  describe('NEGATIVE TESTING', () => {
    let userData: UserData;

    // Generate random user data before each test
    beforeEach(() => {
      userData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: 'Test@12345',
        passwordConfirm: 'Test@12345',
      };
      console.log('\\n🔹 Generated User Data:', userData);
    });

    //  1. Using `done()` - Traditional callback approach
    it('should return 400 if required fields are missing (done)', (done) => {
      request
        .post('/users/signup')
        .send({})
        .expect(400, (err: Error | null, res: Response) => {
          console.log(err);
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.status).toBe('fail');
            expect(res.body.message).toContain(
              'Missing required fields: name, email, password, passwordConfirm'
            );
            done(); // Notify Jest that the test finished successfully
          } catch (error) {
            done(error); // Pass error to Jest if assertions fail
          }
        });
    });

    // ⚡ 2. Using `.end()` - Supertest-specific callback approach
    it('should return 400 if the name field is missing (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          email: userData.email,
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.message).toBe('Missing required fields: name');
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // ✅ Test: Missing Email
    it('should return 400 if the email field is missing (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          name: userData.name,
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.message).toBe('Missing required fields: email');
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // ✅ Test: Missing Password
    it('should return 400 if the password field is missing (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          name: userData.name,
          email: userData.email,
          passwordConfirm: userData.passwordConfirm,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.message).toBe('Missing required fields: password');
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // ✅ Test: Missing Password Confirmation
    it('should return 400 if the passwordConfirm field is missing (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.message).toBe(
              'Missing required fields: passwordConfirm'
            );
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // ✅ Test: Multiple Missing Fields
    it('should return 400 if multiple fields are missing (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          password: userData.password,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            // Validate error response
            expect(res.body.message).toBe(
              'Missing required fields: name, email, passwordConfirm'
            );
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // 🚀 3. Using `.then()` - Modern promise-based approach
    it('should not create a new user with an already used email (.then())', () => {
      // First signup to create the user
      return request
        .post('/users/signup')
        .send(userData)
        .expect(201)
        .then(() => {
          // Second signup with the same email to trigger the duplicate error
          return request
            .post('/users/signup')
            .send(userData)
            .expect(400)
            .then((res: Response) => {
              // Validate error response
              expect(res.body.message).toBe(
                `This email is already in use. Please use another email.`
              );
            });
        });
    });

    // ✅ Additional Example Using `done()` for Password Mismatch
    it('should return 400 if password and passwordConfirm do not match (done)', (done) => {
      request
        .post('/users/signup')
        .send({
          name: userData.name,
          email: userData.email,
          password: 'Test@12345',
          passwordConfirm: 'MismatchPassword',
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            expect(res.body.message).toBe(
              'User validation failed: passwordConfirm: Passwords are not the same!'
            );
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // ⚡ Additional Example Using `.end()` for Invalid Email Format
    it('should return 400 if email is invalid (.end())', (done) => {
      request
        .post('/users/signup')
        .send({
          name: userData.name,
          email: 'invalidEmailFormat',
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
        })
        .expect(400)
        .end((err: Error | null, res: Response) => {
          if (err) return done(err);

          try {
            expect(res.body.message).toBe(
              'User validation failed: email: Please provide a valid email'
            );
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    // 🚀 Additional Example Using `.then()` for Long Password
    it('should return 400 if the password is too long (.then())', () => {
      return request
        .post('/users/signup')
        .send({
          name: userData.name,
          email: userData.email,
          password: 'a'.repeat(101), // Password longer than allowed
          passwordConfirm: 'a'.repeat(101),
        })
        .expect(400)
        .then((res: Response) => {
          expect(res.body.message).toContain(
            'Password longer then 30 characters'
          );
        });
    });
  });
});
