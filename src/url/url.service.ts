import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './createUrl.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUrl(userId: string, dto: CreateUrlDto, ip: string) {
    
  }
}
