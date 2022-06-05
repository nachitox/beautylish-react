import React, { Component } from 'react';

class Product extends Component {
  render() {
    return (
      <li key={this.props.product.id}>
        {this.props.product.brand_name}: {this.props.product.product_name} {this.props.product.price}
      </li>
    );
  }
}

export default Product; // Don’t forget to use export default!
