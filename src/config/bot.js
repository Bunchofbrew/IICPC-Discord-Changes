import { logger } from '../utils/logger.js';


export const botConfig = {
  // =========================
  // BOT PRESENCE
  // =========================
  presence: {
    status: "online",
    activities: [
      {
        name: "Hi! How Can I Help You",
        type: 4,
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
  },

  // =========================
  // /about COMMAND — FILL IN YOUR COMPETITION DETAILS
  // =========================
  aboutCommand: {
    // The slash command name (must be lowercase, no spaces)
    name: "about",

    // Short description shown in Discord's command picker
    description: "Get all information about the competition",

    // ── EMBED CONTENT ──────────────────────────────────────
    embed: {
      // Title shown at the top of the embed
      title: "🏆 Competition Name Here",

      // One-liner shown just below the title
      tagline: "Your competition tagline here",

      // Accent color of the embed border (hex)
      color: "#336699",

      // Thumbnail image URL (competition logo, badge, etc.)
      thumbnail: null,           // e.g. "https://cdn.example.com/logo.png"

      // Banner image at the bottom of the embed
      image: null,               // e.g. "https://cdn.example.com/banner.png"
    },

    // ── COMPETITION DETAILS ────────────────────────────────
    // Each entry becomes a field inside the embed.
    // Set `inline: true` to place two fields side-by-side.
    fields: [
      {
        name: "📋 About",
        value: "Write a short description of what the competition is about.",
        inline: false,
      },
      {
        name: "📅 Start Date",
        value: "DD/MM/YYYY",       // ← fill in
        inline: true,
      },
      {
        name: "🏁 End Date",
        value: "DD/MM/YYYY",       // ← fill in
        inline: true,
      },
      {
        name: "🎯 Eligibility",
        value: "Who can participate? (e.g. Open to all / Age 18+ / etc.)",
        inline: false,
      },
      {
        name: "📜 Rules",
        value: "• Rule 1\n• Rule 2\n• Rule 3",   // ← fill in
        inline: false,
      },
      {
        name: "🏅 Prizes",
        value: "• 🥇 1st Place — \n• 🥈 2nd Place — \n• 🥉 3rd Place — ",  // ← fill in
        inline: false,
      },
      {
        name: "🔗 How to Join",
        value: "Explain how users can register or participate.",
        inline: false,
      },
      {
        name: "📢 Announcements Channel",
        value: "#announcements",   // ← fill in or use channel mention
        inline: true,
      },
      {
        name: "🙋 Organizer",
        value: "@OrganizerName",   // ← fill in
        inline: true,
      },
    ],

    // ── FOOTER ────────────────────────────────────────────
    footer: {
      text: "Good luck to all participants!",
      icon: null,
    },
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  embeds: {
    colors: {
      primary:   "#336699",
      secondary: "#2F3136",
      success:   "#57F287",
      error:     "#ED4245",
      warning:   "#FEE75C",
      info:      "#3498DB",
      light:     "#FFFFFF",
      dark:      "#202225",
      gray:      "#99AAB5",
      blurple:   "#5865F2",
    },
    footer: {
      text: "Titan Bot",
      icon: null,
    },
    thumbnail: null,
    author: {
      name: null,
      icon: null,
      url: null,
    },
  },

  // =========================
  // GENERIC BOT MESSAGES
  // =========================
  messages: {
    noPermission:       "You do not have permission to use this command.",
    cooldownActive:     "Please wait {time} before using this command again.",
    errorOccurred:      "An error occurred while executing this command.",
    missingPermissions: "I am missing required permissions to perform this action.",
    commandDisabled:    "This command has been disabled.",
    maintenanceMode:    "The bot is currently in maintenance mode.",
  },
};


// =========================
// CONFIG VALIDATION
// =========================
export function validateConfig(config) {
  const errors = [];

  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Environment variables check:');
    logger.debug('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
    logger.debug('TOKEN exists:', !!process.env.TOKEN);
    logger.debug('CLIENT_ID exists:', !!process.env.CLIENT_ID);
  }

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN environment variable)");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID environment variable)");
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.POSTGRES_HOST)     errors.push("POSTGRES_HOST is required in production");
    if (!process.env.POSTGRES_USER)     errors.push("POSTGRES_USER is required in production");
    if (!process.env.POSTGRES_PASSWORD) errors.push("POSTGRES_PASSWORD is required in production");
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Bot configuration errors:", configErrors.join("\n"));
  if (process.env.NODE_ENV === "production") process.exit(1);
}


// =========================
// HELPERS
// =========================
export const BotConfig = botConfig;

export function getColor(path, fallback = "#99AAB5") {
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );
  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

export default botConfig;
