import {
	Field,
	GraphQLISODateTime,
	InputType,
	Int,
	ObjectType,
} from "@nestjs/graphql";
import { UserRole } from "./enums";

@ObjectType("UserProfile")
export class UserProfile {
	@Field(() => String)
	walletAddress!: string;

	@Field(() => String, { nullable: true })
	nickname?: string;

	@Field(() => UserRole)
	role!: UserRole;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;
}

@ObjectType("UserProfileStats")
export class UserProfileStats {
	@Field(() => Int)
	purchasedCourses!: number;

	@Field(() => String)
	totalRewards!: string;
}

@ObjectType("UserProfileResponse")
export class UserProfileResponse {
	@Field(() => UserProfile)
	user!: UserProfile;

	@Field(() => UserProfileStats)
	stats!: UserProfileStats;
}

@ObjectType("NonceResponse")
export class NonceResponse {
	@Field(() => String)
	wallet!: string;

	@Field(() => String)
	nonce!: string;

	@Field(() => GraphQLISODateTime)
	expiredAt!: Date;

	@Field(() => String)
	messageToSign!: string;
}

@InputType("LoginInput")
export class LoginInput {
	@Field(() => String)
	wallet!: string;

	@Field(() => String)
	signature!: string;
}

@ObjectType("LoginResponse")
export class LoginResponse {
	@Field(() => String)
	token!: string;

	@Field(() => UserProfile)
	user!: UserProfile;
}

@InputType("UpdateNicknameInput")
export class UpdateNicknameInput {
	@Field(() => String)
	nickname!: string;

	@Field(() => String)
	signature!: string;
}
