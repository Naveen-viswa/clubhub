const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-2_VvzjbIG07',
      userPoolClientId: '16btr3tnq1u6mr9lltiovena90',
      region: 'ap-south-2',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    }
  }
};

export default awsconfig;

