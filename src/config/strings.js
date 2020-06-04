const strings = {
  login: {
    loginButton: 'Login',
    loginMainTitle: 'Manage your projects, tasks and workload at one place easily.',
    loginSubMainTitle:
      'Enter your email address and password to get access your account',
      copyRights : '© Arimac Digital',
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
};

export default strings;
