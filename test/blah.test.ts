import MyLib from '@mirrorworld/core';

describe('blah', () => {
  it('works', () => {
    const lib = new MyLib({
      apiToken: 'foo',
      appId: 'bar',
    });
    expect(lib.sum(1, 1)).toEqual(2);
  });
});
