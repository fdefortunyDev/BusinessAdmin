export enum UsersError {
  invalidCognitoId = 'users.error.invalidCognitoId',
  invalidName = 'users.error.invalidName',
  invalidLastName = 'users.error.invalidLastName',
  invalidEmail = 'users.error.invalidEmail',
  invalidPhone = 'users.error.invalidPhone',
  invalidDocument = 'users.error.invalidDocument',
  invalidPassword = 'users.error.invalidPassword',

  fisrtNameTooLong = 'users.error.fisrtNameTooLong',
  lastNameTooLong = 'users.error.lastNameTooLong',
  documentTooLong = 'users.error.documentTooLong',
  passwordTooLong = 'users.error.passwordTooLong',

  firstNameTooShort = 'users.error.firstNameTooShort',
  lastNameTooShort = 'users.error.lastNameTooShort',
  documentTooShort = 'users.error.documentTooShort',
  passwordTooShort = 'users.error.passwordTooShort',

  notFound = 'users.error.notFound',
  notUpdated = 'users.error.notUpdated',
  notCreated = 'users.error.notCreated',
  notRemoved = 'users.error.notRemoved',
  alreadyExists = 'users.error.alreadyExists',

  cognitoSignUpFailed = 'users.error.cognitoSignUpFailed',
}
