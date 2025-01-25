export enum UsersError {
  invalidCognitoId = 'users.error.invalidCognitoId',
  invalidName = 'users.error.invalidName',
  invalidLastName = 'users.error.invalidLastName',
  invalidEmail = 'users.error.invalidEmail',
  invalidPhone = 'users.error.invalidPhone',
  invalidDocument = 'users.error.invalidDocument',

  fisrtNameTooLong = 'users.error.fisrtNameTooLong',
  lastNameTooLong = 'users.error.lastNameTooLong',
  documentTooLong = 'users.error.documentTooLong',

  firstNameTooShort = 'users.error.firstNameTooShort',
  lastNameTooShort = 'users.error.lastNameTooShort',
  documentTooShort = 'users.error.documentTooShort',

  notFound = 'users.error.notFound',
}
