import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './createUrl.dto';
import * as geoip from 'geoip-lite';
import ms from 'ms';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUrl(userId: string, dto: CreateUrlDto, ip: string) {
    const geo = geoip.lookup(ip || ' ');
    const expireDate = dto.expiresAt || '2h';
    const expire = new Date(Date.now() + ms(expireDate as ms.StringValue));

    const baseShortUrl = nanoid(9);

    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl: dto.originalUrl,
        shortUrl: baseShortUrl,
        expiresAt: expire,
        creatorIp: ip,
        creatorCountry: geo?.country,
        creatorCity: geo?.city,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (!newUrl)
      throw new InternalServerErrorException('Could not create the url');

    return newUrl;
  }

  async redirect(shortCode: string, ip: string): Promise<string> {
    const shortUrlData = await this.prisma.url.findUnique({
      where: { shortUrl: shortCode },
    });

    if (!shortUrlData) throw new NotFoundException('Url not found');

    if (shortUrlData?.expiresAt < new Date())
      throw new GoneException('Url expired');

    await this.prisma.url.update({
      where: { shortUrl: shortCode },
      data: { clicks: { increment: 1 } },
    });

    const geo = geoip.lookup(ip || '');
    const visitCountry = geo?.country;
    const visitCity = geo?.city;

    const newVisitUrl = await this.prisma.visit.create({
      data: {
        ipAdd: ip,
        country: visitCountry,
        city: visitCity,
        url: {
          connect: {
            id: shortUrlData.id,
          },
        },
      },
    });

    if (!newVisitUrl)
      throw new InternalServerErrorException(
        'Could not create visit properties',
      );

    return shortUrlData.originalUrl;
  }

  async deleteShortUrl(id: string): Promise<object> {
    const delUrlData = await this.prisma.url.delete({
      where: { id: id },
    });

    if (!delUrlData) throw new NotFoundException('Url not found');

    return delUrlData;
  }

  async extendUrlData(id: string): Promise<object> {
    const urlData = await this.prisma.url.findUnique({
      where: { id: id },
    });

    if (!urlData) throw new NotFoundException('Url not found');

    await this.prisma.url.update({
      where: { id: id },
      data: {
        expiresAt: new Date(Date.now() + ms('1d')),
      },
    });

    return urlData;
  }

  async regenerateShortUrl(id: string): Promise<object> {
    const urlData = await this.prisma.url.findUnique({
      where: { id: id },
    });

    if (!urlData) throw new NotFoundException('Url not found');

    const shortCode = nanoid(9);

    const newShortUrl = await this.prisma.url.update({
      where: { id: id },
      data: {
        shortUrl: shortCode,
        expiresAt: new Date(Date.now() + ms('1d')),
      },
    });

    return newShortUrl;
  }
}
