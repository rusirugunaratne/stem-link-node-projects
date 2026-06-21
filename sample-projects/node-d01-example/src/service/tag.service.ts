import { TagRepository } from "../repository/tag.repository.js";
import { NotFoundError } from "../errors/appError.js";

const tagRepository = new TagRepository();

export class TagService {
  async createTag(name: string) {
    return await tagRepository.create(name);
  }

  async getAllTags() {
    return await tagRepository.getAll();
  }

  async getTagById(id: number) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }
    return tag;
  }

  async updateTag(id: number, name: string) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }
    return await tagRepository.update(id, name);
  }

  async deleteTag(id: number) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }
    return await tagRepository.delete(id);
  }
}
