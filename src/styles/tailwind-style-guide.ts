// tailwind-style-guide.ts
// Centralized color and style tokens for Wind Speed project
// Use these tokens for consistent styling in components

export const colors = {
  primary: '#ecf4ef',
  navy: '#232946',
  white: '#F4F4F9',
  yellow: '#FEE440',
  lavender: '#B8C1EC',
  gray: '#E7E7E7',
  pink: '#FF6F91',
  green: '#43D8C9',
  primaryGradient: 'bg-gradient-to-r from-primary to-lavender',
  accentGradient: 'bg-gradient-to-r from-pink to-yellow',
  cardBg: 'bg-white',
  cardBorder: 'border-lavender',
  glassShadow: 'shadow-lg',
  glassBlur: 'backdrop-blur-xl',
  darkOverlay: 'bg-navy/80',
  textPrimary: 'text-[#224b32]',
  textNavy: 'text-navy',
  textWhite: 'text-white',
  textYellow: 'text-yellow',
  textLavender: 'text-lavender',
  textGray: 'text-gray',
  textPink: 'text-pink',
  textGreen: 'text-green',
};

export const effects = {
  shadow: 'shadow-lg',
  shadowXL: 'shadow-xl',
  shadow2XL: 'shadow-2xl',
  blur: 'backdrop-blur-xl',
  blurSm: 'backdrop-blur-sm',
  blurLg: 'backdrop-blur-lg',
  rounded: 'rounded-xl',
  rounded2xl: 'rounded-2xl',
  rounded3xl: 'rounded-3xl',
  roundedFull: 'rounded-full',
  opacity60: 'opacity-60',
  opacity0: 'opacity-0',
  opacity100: 'opacity-100',
  transition: 'transition-all',
  duration500: 'duration-500',
};

export const spacing = {
  px8: 'px-8',
  py4: 'py-4',
  p12: 'p-12',
  mxAuto: 'mx-auto',
  gap4: 'gap-4',
  spaceX3: 'space-x-3',
  maxW7xl: 'max-w-7xl',
  minHScreen: 'min-h-screen',
};

export const text = {
  heading: 'text-4xl md:text-5xl font-bold',
  subheading: 'text-3xl font-bold',
  badge: 'text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full',
  button: 'text-white font-semibold text-lg',
  gradient: 'text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text',
};

// Usage example in a component:
// <div className={`${colors.primaryGradient} ${effects.rounded2xl} ${effects.shadow}`}>...</div>
