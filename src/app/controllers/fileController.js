import File from '../models/File';

class fileController {
  async store(req, res) {
    const { originalname: filename, filename: path } = req.file;
    const file = await File.create({ filename, path });
    return res.json(file);
  }
}

export default new fileController();
