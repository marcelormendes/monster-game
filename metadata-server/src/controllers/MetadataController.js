import { Monster } from "../repositories/monster";

export class MetadataController {
  static async getApi(req, res, next) {
    try {
      let monster;

      try {
        monster = await Monster.find({});
        console.log("metadata", metadata);
      } catch (e) {
        return res.status(500).json(e);
      }

      return res.status(201).json(monster);
    } catch (e) {
      console.error(e);
    }
  }
}
