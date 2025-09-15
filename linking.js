
import { REACT_APP_DEV_SERVER, REACT_APP_PROD_SERVER } from "@env"
export const linking = {
  prefixes: [REACT_APP_PROD_SERVER, 'footfall://'],
  config: {
    screens: {
      Signup: 'signup',
    },
  },
};
