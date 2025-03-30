export interface IDeleteProductUseCase {
  execute(this: void, id: string): Promise<void>;
}
