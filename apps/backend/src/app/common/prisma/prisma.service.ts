import {
	Injectable,
	type OnModuleInit,
	type OnModuleDestroy,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@src_prisma/client";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		// 初始化 PrismaClient，配置日志级别
		/* const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL;
		});

		super({
			log: [
				{ emit: "event", level: "query" },
				{ emit: "stdout", level: "info" },
				{ emit: "stdout", level: "warn" },
				{ emit: "stdout", level: "error" },
			],
			errorFormat: "colorless", // 生产环境建议 colorless，开发环境可用 pretty
			accelerateUrl: ``,
		}); */
		const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL,
		});
		super({ adapter });
	}

	async onModuleInit() {
		// 建立连接
		await this.$connect();
	}

	async onModuleDestroy() {
		// 显式断开连接，虽然 Prisma 现在能处理信号，但在 NestJS 生命周期中显式调用更安全
		await this.$disconnect();
	}
}
