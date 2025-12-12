// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom Animation
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        "gradient-y": "gradient-y 8s ease infinite",
        "gradient-xy": "gradient-xy 10s ease infinite",
        float: "float 6s ease-in-out infinite",
        "float-reverse": "float 8s ease-in-out infinite reverse",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center bottom",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left top",
          },
          "25%": {
            "background-position": "right top",
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "right bottom",
          },
          "75%": {
            "background-position": "left bottom",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
          },
          "25%": {
            transform: "translateY(-20px) translateX(10px)",
          },
          "50%": {
            transform: "translateY(0) translateX(20px)",
          },
          "75%": {
            transform: "translateY(20px) translateX(10px)",
          },
        },
      },
      // Custom Background Size
      backgroundSize: {
        "200%": "200% 200%",
        "300%": "300% 300%",
        "400%": "400% 400%",
      },
    },
  },
  plugins: [],
};
