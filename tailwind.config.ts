import type { Config } from "tailwindcss";

const tailwindConfig: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default tailwindConfig;
