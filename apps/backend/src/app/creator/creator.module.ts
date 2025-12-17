import { Module } from "@nestjs/common";
import { PrismaModule } from "../common/prisma/prisma.module";
import { CreatorResolver } from "./creator.resolver";
import { CreatorService } from "./creator.service";

@Module({
	imports: [PrismaModule],
	providers: [CreatorService, CreatorResolver],
})
export class CreatorModule {}
