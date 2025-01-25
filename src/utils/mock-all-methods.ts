/**
 * Generates mocks for all methods of a given class.
 *
 * @param {ObjectConstructor} cls - The class to mock methods for.
 * @return {ObjectConstructor & Record<string, jest.Mock>} The mocked class with all methods replaced by jest mocks.
 */
export function mockAllMethods<T extends object>(cls: {
  new (...args: any[]): T;
}): T & Record<string, jest.Mock> {
  const mocked: Record<string, jest.Mock> = {};

  Object.getOwnPropertyNames(cls.prototype).forEach((key) => {
    mocked[key] = jest.fn();
  });

  return mocked as T & Record<string, jest.Mock>;
}
