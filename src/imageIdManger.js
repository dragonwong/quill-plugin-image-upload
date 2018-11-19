const imageIdManger = {
  id: 0,
  name: 'QUILL_IMAGE_PLUS',
  generate() {
    const id = this.id;
    this.id = id + 1;
    return `${this.name}_${id}`;
  },
}

module.exports = imageIdManger;
