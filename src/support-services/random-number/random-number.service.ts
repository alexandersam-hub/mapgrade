import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomNumberService {
  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
