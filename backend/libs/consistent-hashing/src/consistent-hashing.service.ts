import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class ConsistentHashingService {
  /**
   * @description Hash function using SHA-256 and modulo to get partition index.
   * @param {string} key - Room name or ID
   * @param {number} numBuckets - Total number of partitions
   */
  getPartitionIndex(key: string, numBuckets: number = 10): number {
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    const hashInt = parseInt(hash.slice(0, 8), 16);
    return hashInt % numBuckets;
  }
}
