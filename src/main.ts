import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (origin: string) => {
    // Check if the origin is in a list of allowed origins
    const whitelist = ['http://127.0.0.1:8080', 'http://localhost:3000']; // Add your allowed origins here
    return whitelist.includes(origin);
  };

    app.enableCors({

      origin: (origin, callback) => {
        if (!origin || allowedOrigins(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent with the request
    });

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
    .setTitle("Tournaments API")
    .setDescription("The Tournaments API guide for developers")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    await app.listen(3001);
}
bootstrap();
