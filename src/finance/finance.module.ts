import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../redis/cache.service';

@Module({
  imports: [AuthModule],
  providers: [FinanceService, CacheService],
  controllers: [FinanceController]
})
export class FinanceModule { }
