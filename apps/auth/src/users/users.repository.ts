import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/database/abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "./entities/user.schema";

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
	protected readonly logger = new Logger(UsersRepository.name);

	constructor(
		@InjectModel(UserDocument.name)
		readonly userModel: Model<UserDocument>
	) {
		super(userModel);
	}
}
