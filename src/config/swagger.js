const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lapor Pak API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API untuk sistem pelaporan Lapor Pak",
      contact: {
        name: "Lapor Pak Developer",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT anda dengan format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Report: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 1 },
            title: { type: "string", example: "Jalan Rusak di JL. Merdeka" },
            description: { type: "string", example: "Terdapat lubang besar yang membahayakan pengendara" },
            category: { type: "string", example: "Infrastruktur" },
            location: { type: "string", example: "Jl. Merdeka No. 12" },
            status: { type: "string", enum: ["PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"], example: "PENDING" },
            admin_response: { type: "string", nullable: true, example: "Laporan diterima dan sedang diproses" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Pesan error" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
