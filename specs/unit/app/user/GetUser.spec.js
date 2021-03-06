
const GetUser = require('src/app/user/GetUser');

describe('App :: User :: GetUser', () => {
  let getUser;

  describe('when user exists', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        getById: userId => Promise.resolve({
          id: userId,
          name: 'The User',
        }),
      };

      getUser = new GetUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits SUCCESS with the user', (done) => {
      getUser.on(getUser.outputs.SUCCESS, (user) => {
        expect(user.id).toEqual(123);
        expect(user.name).toEqual('The User');
        done();
      });

      getUser.execute(123);
    });
  });

  describe('when user does not exist', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        getById: () => Promise.reject({
          details: 'User with id 123 can\'t be found.',
        }),
      };

      getUser = new GetUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits NOT_FOUND with the error', (done) => {
      getUser.on(getUser.outputs.NOT_FOUND, (error) => {
        expect(error.details).toEqual('User with id 123 can\'t be found.');
        done();
      });

      getUser.execute(123);
    });
  });
});
