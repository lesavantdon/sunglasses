const request = require('supertest');
const app = require('../app/initial-data/server');

let token;

beforeAll((done) => {
  request(app)
    .post('/users/login')
    .send({
      email: 'user@example.com',
      password: 'password'
    })
    .end((err, response) => {
      token = response.body.accessToken;
      done();
    });
});

describe('Cart API', () => {
  it('should get user cart', async () => {
    const res = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
  });

  it('should add product to cart', async () => {
    const res = await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 1,
        quantity: 1
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
  });

  it('should delete product from cart', async () => {
    const res = await request(app)
      .delete('/cart')
      .set('Authorization', `Bearer ${token}`)
      .query({ productId: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Product removed from cart');
  });

  it('should change quantity of product in cart', async () => {
    await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 1,
        quantity: 1
      });

    const res = await request(app)
      .patch('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 1,
        quantity: 2
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Quantity updated');
  });
});

