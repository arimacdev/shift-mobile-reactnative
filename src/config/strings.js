const strings = {
  config: {
    configMainTitle: 'Welcome to Arimac SHIFT',
    configSubTitle: 'Please enter your Organization URL to continue.',
    configBottomText:
      'Contact your organization administrator to get the organization URL',
    configButton: 'OK',
    configError:'Sorry, we did not find such organization' 
  },
  login: {
    loginButton: 'Login',
    loginMainTitle:
      'Manage your projects, tasks and workload at one place easily.',
    loginSubMainTitle:
      'Enter your email address and password to get access your account',
    copyRights: '© Arimac Digital',
    loginText:'You are logging in to',
    goBack:'Go Back'
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
  },

  oneSignalId:'45e39e49-0bb3-4d57-a9f9-9c6dcbe2e118'
};

export default strings;
