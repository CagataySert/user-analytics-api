import { Controller, Get, UseGuards, Logger } from "@nestjs/common";
import { AdminAnalyticsService } from "./admin-analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { RoleName } from "../roles/role.enum";
import { RedisCacheService } from "../common/services/redis-cache.service";
import { CacheTTL,CacheKey } from "@nestjs/cache-manager";

@Controller("admin-analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
export class AdminAnalyticsController {
  private readonly logger = new Logger(AdminAnalyticsController.name);

  constructor(
    private readonly adminService: AdminAnalyticsService,
    private readonly redisCache: RedisCacheService
  ) {}

  @Get("metrics")
  async getAdminMetrics() {
    const cacheKey = "admin-analytics-metrics";
    const cacheTTL = 600; // 10 minutes

    const cachedMetrics = await this.redisCache.get(cacheKey);
    if (cachedMetrics) {
      this.logger.debug("Returning cached metrics");
      return cachedMetrics;
    }

    const metrics = await this.adminService.getAdminMetrics();
    await this.redisCache.set(cacheKey, metrics, cacheTTL); // Cache for 10 minutes
    return metrics;
  }

}
