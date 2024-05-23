export class News {
  constructor(title, author, source, shortDescription, content, thumbnail) {
    this.title = title;
    this.author = author;
    this.source = source;
    this.shortDescription = shortDescription;
    this.content = content;
    this.thumbnail = thumbnail;
    this.category = [];
  }

  addCategory(category) {
    this.category.push(category.id);
  }
}

export class Category {
  constructor(id) {
    this.id = id;
  }
}
