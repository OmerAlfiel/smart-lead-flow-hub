import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Smart Lead Flow Hub API is running!';
  }
}