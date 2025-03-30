export const QUERY_CREATE_PRODUCT = `INSERT INTO products (name, description, price , stock)
  VALUES ($1, $2, $3) 
  RETURNING  id, name, description, price, stock, created_at, updated_at
  `;
export const QUERY_FIND_ALL_PRODUCTS = `
  SELECT id, name, description, price, stock, created_at, updated_at
  FROM products
  ORDER BY created_at DESC
  `;
export const QUERY_FIND_PRODUCT_BY_ID = `
  SELECT id, name, description, price, stock, created_at, updated_at
  FROM products
  WHERE id = $1
  `;

export const QUERY_UPDATE_PRODUCT = `
  UPDATE products
  SET name = $1, description = $2, price = $3, stock = $4, updated_at = NOW()
  WHERE id = $5
  RETURNING id, name, description, price, stock, created_at, updated_at
  `;

export const QUERY_DELETE_PRODUCT = `
  DELETE FROM products
  WHERE id = $1
  `;
