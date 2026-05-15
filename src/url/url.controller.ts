import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import 'dotenv/config';
import { UrlService } from './url.service';
import { CreateUrlDto } from './createUrl.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createShortUrl(
    @Body() dto: CreateUrlDto,
    @Req() req: Request,
  ): Promise<object> {
    const reqIp = req.headers['x-forwarded-for'];
    const ip =
      typeof reqIp === 'string' ? reqIp.split(',')[0] : (req.ip as string);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = ((req as any)?.user?.sub as string) ?? '';
    const newShortUrl = await this.urlService.createUrl(userId, dto, ip);

    if (!newShortUrl)
      throw new InternalServerErrorException('Short Url could not be created');
    // console.log(userId);
    return {
      data: process.env.SHORT_URL_BASE + 'url/' + newShortUrl.shortUrl,
    };
  }

  @Get(':shortCode')
  async redirectUrl(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const forward = req.headers['x-forwarded-for'];
    const ip =
      typeof forward === 'string' ? forward.split(',')[0] : (req.ip as string);

    const originalUrl = await this.urlService.redirect(shortCode, ip);

    if (!originalUrl) throw new NotFoundException('Url not found');

    return res.redirect(originalUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUrl(@Param('id') id: string): Promise<object> {
    const delData = await this.urlService.deleteShortUrl(id);

    return {
      msg: 'URL deleted',
      data: delData,
    };
  }

  @Patch('extend/:id')
  @UseGuards(JwtAuthGuard)
  async extendUrl(@Param('id') id: string) {
    const extended = await this.urlService.extendUrlData(id);

    if (!extended) throw new InternalServerErrorException('Operation failed');

    return {
      msg: 'Short URL extended for 24 hours from now',
      data: extended,
    };
  }

  @Patch('regenerate/:id')
  @UseGuards(JwtAuthGuard)
  async regenerate(@Param('id') id: string): Promise<object> {
    const regData = await this.urlService.regenerateShortUrl(id);

    if (!regData) throw new InternalServerErrorException('Operation failed');

    return {
      msg: 'Short URL regenerated and expiry date extended',
      data: regData,
    };
  }
}
