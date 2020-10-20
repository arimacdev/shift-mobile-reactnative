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
    clientId: 'U2FsdGVkX19FzdF9pkp/zXdAzVjjTCRKLsVjl1BtD+7u34rJHOnZIDPpVrI60FOD', // found under App Credentials
    clientSecret: 'U2FsdGVkX18w1a9zsZ3akuqYiqu+/DTI1nqUdQckFNp6r+9PW9Hd2s2hcG9bvTQDQXRC/hPrUD4MFMQdphSqOw=', // found under App Credentials
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
    oneSignalAppId: 'U2FsdGVkX1/mmH45CQsq1g3H5CkQQlBLP7cxkkHgL/3/+JrO/RZfwqNDypZiTuE0sZSUu+vVj5h7tNk4scFdVQ=='
  },
};

export default strings;
