import { Module } from "@nestjs/common";
import { PrismaModule } from "../common/prisma/prisma.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
	imports: [PrismaModule],
	providers: [AuthService, AuthResolver],
	exports: [AuthService],
})
export class AuthModule {}
