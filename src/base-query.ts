import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export abstract class BaseQuery<Entity> {
  protected repository: Repository<Entity>;

  constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  async findById(id: any): Promise<Entity | undefined> {
    return this.repository.findOneById(id);
  }

  async findOneByData(data: any): Promise<Entity | undefined> {
    return this.repository.findOne({ where: data });
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  async create(data: Partial<Entity>): Promise<Entity> {
    const entity = this.repository.create(data as Entity);
    return this.repository.save(entity);
  }

  async insert(data: Partial<Entity>): Promise<Entity> {
    return this.repository.save(data as Entity);
  }

  async insertMany(data: Partial<Entity>[]): Promise<Entity[]> {
    return this.repository.save(data as Entity[]);
  }

  async findOneAndUpdate(id: any, data: Partial<Entity>): Promise<Entity> {
    await this.repository.update(id, data as QueryDeepPartialEntity<Entity>);
    return this.repository.findOne(id);
  }

  async upsertData(data: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[], checkField: string[]): Promise<Entity> {
    await this.repository.upsert(data, checkField);
    const criteria = checkField.reduce((acc, field) => ({ ...acc, [field]: data[field] }), {});
    return await this.repository.findOneOrFail({ where: criteria });
  }
  
  async deleteById(id: number | string): Promise<Entity> {
    const item = await this.repository.findOneById(id);
    if (!item) {
      throw new Error('Entity not found');
    }
    await this.repository.delete(id);
    return item;
  }

  async countByData(data: FindOptionsWhere<Entity>): Promise<number> {
    return this.repository.countBy(data);
  }

  async update(id: number | string, data: Partial<Entity>): Promise<Entity> {
    const item = await this.repository.findOneById(id);
    if (!item) {
      throw new Error('Entity not found');
    }
    await this.repository.update(id, data as QueryDeepPartialEntity<Entity>);
    return item;
  }
}
