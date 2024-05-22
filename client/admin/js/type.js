export class News {
  #id;
  #title;
  #author;
  #source;
  #category;
  #shortDescription;
  #content;
  #thumbnail;

  constructor(
    title,
    author,
    source,
    category,
    shortDescription,
    content,
    thumbnail
  ) {
    this.#title = title;
    this.#author = author;
    this.#source = source;
    this.#category = category;
    this.#shortDescription = shortDescription;
    this.#content = content;
    this.#thumbnail = thumbnail;
  }
  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get author() {
    return this.#author;
  }
  get source() {
    return this.#source;
  }
  get category() {
    return this.#category;
  }
  get shortDescription() {
    return this.#shortDescription;
  }
  get content() {
    return this.#content;
  }
  get thumbnail() {
    return this.#thumbnail;
  }
  set title(title) {
    this.#title = title;
  }
  set author(author) {
    this.#author = author;
  }
  set source(source) {
    this.#source = source;
  }
  set category(category) {
    this.#category = category;
  }
  set shortDescription(shortDescription) {
    this.#shortDescription = shortDescription;
  }
  set content(content) {
    this.#content = content;
  }
  set thumbnail(thumbnail) {
    this.#thumbnail = thumbnail;
  }
  set id(id) {
    this.#id = id;
  }
}

export class Category {
  #id;
  #name;
  constructor(name) {
    this.#name = name;
  }
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  set id(id) {
    this.#id = id;
  }
  set name(name) {
    this.#name = name;
  }
}
