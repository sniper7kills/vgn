import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET')
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://veteransgaragenetwork.com/profile',
        'https://veterangaragenetwork.com/profile'
      ],
      logoutUrls: [
        'http://localhost:3000',
        'https://veteransgaragenetwork.com',
        'https://veterangaragenetwork.com'
      ],
    }
  },
});
