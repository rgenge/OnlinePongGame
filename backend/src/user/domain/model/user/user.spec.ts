import { User } from './user';

describe('User', () => {
  it('should be defined', () => {
    // arranje
    const nickname = 'JoãoDoPão';

    // act
    const user = new User({ nickname });

    // assert
    expect(user.getNickname()).toBe(nickname);
  });
});
