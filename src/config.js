/**
 * ISHIKA — A Magical Birthday Universe
 * Central Personalization & Configuration
 */

export const CONFIG = {
  // Personalization
  birthdayPersonName: "Ishika",
  birthdayTitle: "Happy Birthday",
  subtitle: "A Magical Birthday Universe",
  senderName: "", // Kept empty unless Arya specifies a sender name

  // Visual Theme Palette
  themeColors: {
    midnightPurple: "#130824",
    deepPlum: "#291036",
    lavender: "#BE9BFF",
    blushPink: "#F8BBD9",
    champagneGold: "#F4D58D",
    ivory: "#FFF8F0",
    roseGold: "#D99A9D",
  },

  // Feature Toggles
  enableMusic: true,
  enableParticles: true,
  enableWishingSky: true,
  enableBalloonGame: true,
  enablePhotoKeepsake: true,

  // Dedicated Photos Collection - Configured with Ishika's photos!
  photoAssets: [
    {
      url: "./assets/photos/photo1.jpg",
      title: "Radiant Grace",
      caption: "A smile that lights up the entire room effortlessly.",
      tag: "Pure Radiance ✨"
    },
    {
      url: "./assets/photos/photo2.jpg",
      title: "Precious Moments",
      caption: "Every shared laugh and conversation leaves a golden memory.",
      tag: "Heart of Gold 💛"
    },
    {
      url: "./assets/photos/photo3.jpg",
      title: "Timeless Elegance",
      caption: "Grace in every step and beauty in every thought.",
      tag: "Simply Beautiful 🌸"
    },
    {
      url: "./assets/photos/photo4.jpg",
      title: "Unforgettable Joy",
      caption: "May your heart always be as light and joyful as this moment.",
      tag: "Charming Soul 💫"
    },
    {
      url: "./assets/photos/photo5.jpg",
      title: "Chasing Dreams",
      caption: "May every path you choose lead you to peace and soaring heights.",
      tag: "Dreamer 🌟"
    },
    {
      url: "./assets/photos/photo6.jpg",
      title: "Gentle Sunshine",
      caption: "Bringing warmth and kindness wherever you go.",
      tag: "Warmth & Love 💖"
    },
    {
      url: "./assets/photos/photo7.jpg",
      title: "A Brand New Chapter",
      caption: "Here's to celebrating you today and all the wondrous years ahead.",
      tag: "Celebration 👑"
    }
  ],

  // Illustrated Gallery Cards (fallback if needed)
  defaultGalleryCards: [
    {
      title: "Little moments, big smiles",
      caption: "May every single day give you reasons to laugh from the heart.",
      tag: "Pure Joy",
      icon: "🌸",
      artClass: "art-bloom"
    },
    {
      title: "Beautiful memories",
      caption: "Every shared conversation, warmth, and kind gesture leaves a golden trail.",
      tag: "Cherished",
      icon: "✨",
      artClass: "art-stars"
    },
    {
      title: "Wonderful adventures",
      caption: "To places yet to be visited, sunrises to watch, and stories to create.",
      tag: "Wanderlust",
      icon: "🚀",
      artClass: "art-adventures"
    },
    {
      title: "New chapters ahead",
      caption: "A fresh chapter full of peace, success, and genuine happiness.",
      tag: "New Horizon",
      icon: "🦋",
      artClass: "art-future"
    }
  ],

  // Exact Specified Letter Text for Scene 08
  recipientMessage: `Dear Ishika,

Some days are special simply because of the people they celebrate.

Today is one of those days.

May this new year of your life bring endless happiness, wonderful opportunities, unforgettable adventures, peaceful moments, and dreams that turn into reality.

May every new sunrise bring another reason to smile.

Keep shining, keep growing, and keep creating beautiful memories.

You deserve a year filled with joy, kindness and beautiful surprises.

Wishing you the happiest birthday and an extraordinary year ahead.

Happy Birthday, Ishika! ✨`,

  // Scene 09: 6 Celestial Wishing Star Blessings
  wishingSkyBlessings: [
    "Endless happiness",
    "Beautiful new beginnings",
    "Dreams coming true",
    "Love and laughter",
    "Good health and peace",
    "Wonderful surprises"
  ],

  // Scene 06: Treasure Room Blessings
  treasureWishes: {
    envelope: "May happiness find you in every little moment.",
    scratch: "YOU ARE AMAZING, ISHIKA! ✨",
    balloons: [
      "More happiness",
      "More adventures",
      "More beautiful memories"
    ],
    star: "May your brightest dreams become reality."
  }
};
