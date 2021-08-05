const config = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-tutorial-imbayard",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://h87yakzupk.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_N2gLhBaeg",
      APP_CLIENT_ID: "6oom848l165vujk0oj9jfi26vm",
      IDENTITY_POOL_ID: "us-east-1:64eef303-b1f0-4722-9caa-def9e00221c4",
    },
  };
  
  export default config;