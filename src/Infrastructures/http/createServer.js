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

  // --- REGISTER EXTERNAL PLUGINS ---
  if (process.env.NODE_ENV !== 'test') {
    await server.register({
      plugin: HapiRateLimit,
      options: {
        userLimit: 90,
        userCache: { expiresIn: 60000 },
        pathLimit: false,
        trustProxy: true,
        ipWhitelist: [],
      },
    });
  }

  // JWT tetap harus jalan
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // --- AUTH STRATEGY ---
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

  // --- REGISTRASI PLUGIN INTERNAL ---
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

  // --- ERROR HANDLING (PERBAIKAN LOGIKA) ---
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // 1. Handle Rate Limit Error (429) dari Plugin
      if (response.output && response.output.statusCode === 429) {
        return h.response({
          status: 'fail',
          message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
        }).code(429);
      }

      // 2. Translate Domain Error
      const translatedError = DomainErrorTranslator.translate(response);

      // 3. Handle ClientError
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // 4. Handle Native Hapi Errors (seperti 404 Route Not Found)
      // Jangan diubah jadi 500, biarkan Hapi yang handle
      if (response.isBoom && response.output.statusCode < 500) {
        return h.continue;
      }

      // 5. Handle ServerError (500)
      // Debug: Cetak error asli ke terminal untuk mempermudah fix jika ada bug lain
      console.error(response);

      // Return Custom JSON 500
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
