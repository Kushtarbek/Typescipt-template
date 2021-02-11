import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mock from 'src/utils/mock';
import wait from 'src/utils/wait';

const JWT_SECRET = 'devias-top-secret-key';
const JWT_EXPIRES_IN = '2 days';

const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/images/avatars/avatar_6.png',
    canHire: false,
    country: 'USA',
    email: 'demo@devias.io',
    isPublic: true,
    name: 'Katarina Smith',
    password: 'Password123',
    phone: '+40 777666555',
    role: 'admin',
    state: 'New York',
    tier: 'Premium',
  },
];

mock.onPost('/api/account/login').reply(async (config) => {
  try {
    await wait(1000);

    const { email, password } = JSON.parse(config.data);
    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [400, { message: 'Please check your email and password' }];
    }

    if (user.password !== password) {
      return [400, { message: 'Invalid password' }];
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
      },
    ];
  } catch (err) {
    return [500, { message: 'Internal server error' }];
  }
});

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await wait(1000);

    const { email, name, password } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [400, { message: 'User already exists' }];
    }

    user = {
      id: uuidv4(),
      avatar: null,
      canHire: false,
      country: null,
      email,
      isPublic: true,
      name,
      password,
      phone: null,
      role: 'admin',
      state: null,
      tier: 'Standard',
    };

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
      },
    ];
  } catch (err) {
    return [500, { message: 'Internal server error' }];
  }
});

mock.onGet('/api/account/me').reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Authorization token missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const { userId } = jwt.verify(accessToken, JWT_SECRET) as any;
    const user = users.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: 'Invalid authorization token' }];
    }

    return [
      200,
      {
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
      },
    ];
  } catch (err) {
    return [500, { message: 'Internal server error' }];
  }
});

mock.onGet('/api/account/settings').reply(200, {
  settings: {},
});

mock.onGet('/api/account/subscription').reply(200, {
  subscription: {
    name: 'Premium',
    price: 29,
    currency: '$',
    proposalsLeft: 12,
    templatesLeft: 5,
    invitesLeft: 24,
    adsLeft: 10,
    hasAnalytics: true,
    hasEmailAlerts: true,
  },
});

mock.onGet('/api/account/tier').reply(200, {
  tiers: [
    {
      title: 'Free',
      price: '0',
      description: ['10 users included', '250 item listing', 'Help center access', 'Email support'],
      buttonVariant: 'outlined',
    },
    {
      title: 'Solopreneur',
      price: '29.99',
      description: ['10 users included', '500 item listing', 'Help center access', 'Email support'],

      buttonVariant: 'outlined',
    },
    {
      title: 'Reseller Growth',
      price: '49.99',
      description: ['20 users included', '750 item listing', 'Help center access', 'Priority email support'],

      buttonVariant: 'contained',
    },
    {
      title: 'Reseller Pro',
      price: '79.99',
      description: ['50 users included', '1000 item listing', 'Help center access', 'Phone & email support'],

      buttonVariant: 'outlined',
    },
  ],
});

mock.onGet('api/account/salesChannel').reply(200, {
  channels: {
    poshmark: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },

    tradesy: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },

    mercari: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },

    vestiaire: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },

    shopify: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },

    ebay: {
      accounts: [
        { username: 'jebwa', password: 'Demo1234' },
        { username: 'Jebwa_Luxury', password: 'Demo2345' },
      ],
      settings: {
        email_alerts: true,
        text_message: true,
        push_notification: false,
        phone_calls: true,
        chat_app_email: false,
        chat_app_notifications: true,
      },
    },
  },
});
