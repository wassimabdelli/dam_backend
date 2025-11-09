import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URI), // <-- Utilisation de la variable d'environnement
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
