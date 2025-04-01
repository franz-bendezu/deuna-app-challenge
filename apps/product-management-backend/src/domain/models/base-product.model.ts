export class BaseProduct {
  constructor(
    public name?: string,
    public description?: string,
    public price?: number,
    public stock?: number,
  ) {}
}
