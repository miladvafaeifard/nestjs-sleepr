import { Logger, NotFoundException } from '@nestjs/common';
import { Model, Types, QueryFilter, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;
    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
         const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON();
    }

    async findOne(queryFilter: QueryFilter<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(queryFilter).lean(true);

        if (!document) {
            this.logger.warn('Document not found with queryFilter', queryFilter);
            throw new NotFoundException('Document not found');
        }

        return document;
    }

    async findOneOrNull(queryFilter: QueryFilter<TDocument>): Promise<TDocument | null> {
        const document = await this.model.findOne(queryFilter).lean(true);
        if (!document) {
            this.logger.warn('Document not found with queryFilter', queryFilter);
            return null;
        }
        
        return document;
    }

    async find(queryFilter: QueryFilter<TDocument>): Promise<TDocument[]> {
        return this.model.find(queryFilter).lean(true);
    }

    async findOneAndUpdate(queryFilter: QueryFilter<TDocument>, document: UpdateQuery<TDocument>): Promise<TDocument | null> {
        const updatedDocument = await this.model.findOneAndUpdate(queryFilter, document, { new: true }).lean(true);

        if (!updatedDocument) {
            this.logger.warn('Document not found with queryFilter', queryFilter);
            throw new NotFoundException('Document not found');
        }

        return updatedDocument;
    }

    async findOneAndDelete(queryFilter: QueryFilter<TDocument>): Promise<TDocument | null> {
        const deletedDocument = await this.model.findOneAndDelete(queryFilter).lean(true);

        if (!deletedDocument) {
            this.logger.warn('Document not found with queryFilter', queryFilter);
            throw new NotFoundException('Document not found');
        }

        return deletedDocument;
    }
}