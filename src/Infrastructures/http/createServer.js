const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const HapiRateLimit = require('hapi-rate-limit');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');

// --- Import Plugins ---
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
  });

  await server.register([
    {
      plugin: HapiRateLimit,
      options: {
        userLimit: 90, // Maksimal 90 request
        userCache: {
          expiresIn: 60000, // Per 1 menit (60 detik)
        },
        pathLimit: false, // Hitung limit per user (IP), bukan per path
        trustProxy: true,
        ipWhitelist: [],
      },
    },
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
  ]);

  // Middleware Error Handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      if (response.output && response.output.statusCode === 429) {
        return h.response({
          status: 'fail',
          message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
        }).code(429);
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
