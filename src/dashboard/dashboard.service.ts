import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserOverview(userId: string) {
    const now = new Date();

    const totalUrls = await this.prisma.url.count({
      where: { userId },
    });

    const activeUrls = await this.prisma.url.count({
      where: {
        userId,
        expiresAt: { gt: now },
      },
    });

    const expiredUrl = await this.prisma.url.count({
      where: {
        userId,
        expiresAt: { lt: now },
      },
    });

    const Clicks = await this.prisma.url.aggregate({
      where: { userId },
      _sum: { clicks: true },
    });

    const totalClicks = Clicks._sum.clicks ?? 0;

    return { totalUrls, activeUrls, expiredUrl, totalClicks };
  }

  async getUserUrls(userId: string, page: number, limit: number) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const skips = (pageNumber - 1) * limitNumber;

    const [urls, totalUrls] = await Promise.all([
      this.prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: skips,
        take: limitNumber,
      }),

      this.prisma.url.count({ where: { userId } }),
    ]);

    const data = urls.map((url) => ({
      id: url.id,
      shortcode: url.shortUrl,
      shortUrl: `${process.env.SHORT_URL_BASE}/${url.shortUrl}`,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      status:
        url.expiresAt && url.expiresAt < new Date() ? 'Active' : 'Expired',

      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    }));

    return {
      data,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalUrls,
        totalPages: Math.ceil(totalUrls / limitNumber),
      },
    };
  }

  async getUserAnalytics(userId: string, urlId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
    });

    if (!url) throw new NotFoundException('Url not found');

    if (url.userId != userId) throw new ForbiddenException();

    const totalClicks = url.clicks;

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    const [todayClicks, topCountries] = await Promise.all([
      this.prisma.visit.count({
        where: {
          visitedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.visit.groupBy({
        by: ['country'],
        where: { id: urlId },
        _count: { country: true },
        orderBy: {
          _count: {
            country: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalClicks,
      todayClicks,
      topCountries: topCountries.map((country) => ({
        country: country.country,
        clicks: country._count.country,
      })),
    };
  }

  async getAdminOverview() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalUrls,
      totalClicks,
      usersToday,
      urlsToday,
      clicksToday,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.url.count(),

      this.prisma.visit.count(),

      this.prisma.user.count({
        where: {
          createdAt: { gt: today },
        },
      }),

      this.prisma.url.count({
        where: {
          createdAt: {
            gt: today,
          },
        },
      }),

      this.prisma.visit.count({
        where: {
          visitedAt: { gt: today },
        },
      }),
    ]);

    return {
      totalUsers,
      totalUrls,
      totalClicks,
      usersToday,
      urlsToday,
      clicksToday,
    };
  }

  async getAllUsers(page: number, limit: number) {
    const skips = (page - 1) * limit;

    const [users, totalUser] = await Promise.all([
      this.prisma.user.findMany({
        skip: skips,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { urls: true } },
        },
      }),

      this.prisma.user.count(),
    ]);

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      joinedAt: user.createdAt,
      urlsCreated: user._count.urls,
    }));

    return {
      data,
      pagination: {
        page,
        totalPage: Math.ceil(totalUser / limit),
      },
    };
  }
}
