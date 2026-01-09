import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [QuizzesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
