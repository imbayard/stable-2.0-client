const config = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-tutorial-imbayard",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://7sdnyj4xfa.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_N2gLhBaeg",
      APP_CLIENT_ID: "6oom848l165vujk0oj9jfi26vm",
      IDENTITY_POOL_ID: "us-east-1:b2d96a45-95bb-4ada-acb0-a5883015d7eb",
    },
  };
  
  export default config;