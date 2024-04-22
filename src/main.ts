import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: 'http://localhost:3000', // Allow requests from the frontend server
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
