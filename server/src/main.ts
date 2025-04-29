import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Global prefix
  const apiPrefix = configService.get<string>('apiPrefix');
  app.setGlobalPrefix(apiPrefix);
  
  // Security
  app.use(helmet());
  app.enableCors();
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Smart Lead Flow Hub API')
    .setDescription('API for managing leads and campaigns')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  
  // Start the server
  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();