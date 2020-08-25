const strings = {
  config: {
    configMainTitle: 'Welcome to Arimac SHIFT',
    configSubTitle: 'Please enter your Organization Nickname to continue.',
    configBottomText:
      'Contact your organization administrator to get the organization nickname',
    configButton: 'OK',
    configError: 'Sorry, we did not find such organization',
  },
  login: {
    loginButton: 'Login',
    loginMainTitle:
      'Manage your projects, tasks and workload at one place easily.',
    loginSubMainTitle:
      'Enter your email address and password to get access your account',
    copyRights: '© Arimac Digital',
    loginText: 'You are logging in to',
    goBack: 'Go Back',
  },
  slack: {
    clientId: '345426929140.1020110511447', // found under App Credentials
    clientSecret: 'fd851b7af77e525c1700879de9b328ab', // found under App Credentials
    scopes: ['incoming-webhook,chat:write'],
    // redirectUrl: 'io.identityserver.demo://oauthSlackredirect',
    redirectUrl: 'com.arimacpmtool://oauthSlackredirect',
    serviceConfiguration: {
      authorizationEndpoint: 'https://slack.com/oauth/v2/authorize',
      tokenEndpoint: 'https://slack.com/api/oauth.v2.access',
    },
    dangerouslyAllowInsecureHttpRequests: true,
    // additionalParameters: { prompt: 'login' } // If uncommment then the user will always be shown the login prompt.
  },

  oneSignal: {
    oneSignalAppId: 'fe6df906-c5cf-4c5e-bc1f-21003be4b2d5',
  },
};

export default strings;
