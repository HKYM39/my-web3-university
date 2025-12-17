import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
	USER = "USER",
	CREATOR = "CREATOR",
	ADMIN = "ADMIN",
}

export enum CourseStatus {
	DRAFT = "DRAFT",
	PENDING = "PENDING",
	PUBLISHED = "PUBLISHED",
	REJECTED = "REJECTED",
}

export enum PayToken {
	YIDENG = "YIDENG",
	ETH = "ETH",
}

export enum RewardType {
	COURSE = "COURSE",
	DAILY = "DAILY",
}

export enum ArticleStatus {
	DRAFT = "DRAFT",
	PUBLISHED = "PUBLISHED",
}

registerEnumType(UserRole, { name: "UserRole" });
registerEnumType(CourseStatus, { name: "CourseStatus" });
registerEnumType(PayToken, { name: "PayToken" });
registerEnumType(RewardType, { name: "RewardType" });
registerEnumType(ArticleStatus, { name: "ArticleStatus" });
