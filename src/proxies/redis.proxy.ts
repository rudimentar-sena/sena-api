import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class RedisProxy {
  private readonly redis: Redis;

  constructor(private readonly logger: LoggerService) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  async saveMessage(messageData: {
    content: string;
    user: "person" | "agent";
    date: string;
  }, id: string) {
    try {
      await this.redis.lpush(id, JSON.stringify(messageData));
      return messageData;
    } catch (error) {
      this.logger.error('Error saving message', error);
      throw new HttpException('Error saving message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllMessages(id: string) {  
    try {
      const messages = await this.redis.lrange(id, 0, -1);
      return messages.map(message => JSON.parse(message));
    } catch (error) {
      this.logger.error('Error getting all messages', error);
      throw new HttpException('Error getting all messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
