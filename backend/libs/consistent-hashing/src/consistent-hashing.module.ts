import { Module } from '@nestjs/common';
import { ConsistentHashingService } from './consistent-hashing.service';

@Module({
  providers: [ConsistentHashingService],
  exports: [ConsistentHashingService],
})
export class ConsistentHashingModule {}
