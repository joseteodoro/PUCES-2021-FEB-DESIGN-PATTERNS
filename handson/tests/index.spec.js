
const clients = [
  {id: 1, name: 'Acme Corporation'},
  {id: 2, name: 'Globex Corporation'},
  {id: 3, name: 'Soylent Corp'},
  {id: 4, name: 'Umbrella Corporation'},
  {id: 5, name: 'Evilcorp'},
]

const products = [
  {id: 100, name: 'Sugar', price: 10.0},
  {id: 200, name: 'Salt', price: 11.0},
  {id: 300, name: 'Flour', price: 12.0},
  {id: 400, name: 'Eggs', price: 13.0},
]

const prices = [
  {id: 101, price: 9.0, client: 1, product: 100},
  {id: 201, price: 9.5, client: 1, product: 200},
  {id: 202, price: 10.0, client: 2, product: 200},
  {id: 203, price: 10.0, client: 3, product: 200},
]

const priceByClient = ({ client, product }) => {

}

const updatePrice = ({product, price, client }) => {

}

const listProducts = () => {
  return products;
}

const productPrices = ({clientId}) => {
  const prods = listProducts();

}

describe('', () => {
  describe(``, () => {
    it.only('simple', () => {

    });
  });
});
