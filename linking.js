
const config = {
  screens: {
    Signup: {
      path: 'signup',
      parse: {
        referralCode: (referralCode) => `${referralCode}`,
      },
    },
  },
};

const linking = {
  prefixes: ['footfall://', 'https://footfallapp.com'],
  config,
};

export default linking;