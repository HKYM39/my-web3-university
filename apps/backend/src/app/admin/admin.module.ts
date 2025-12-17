import { Module } from "@nestjs/common";
import { PrismaModule } from "../common/prisma/prisma.module";
import { AdminResolver } from "./admin.resolver";
import { AdminService } from "./admin.service";

@Module({
	imports: [PrismaModule],
	providers: [AdminService, AdminResolver],
})
export class AdminModule {}
