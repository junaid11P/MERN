import React from 'react';


const Products = () => {
  const products = [
    {
      id: 1,
      name: "Professional Basketball",
      price: 29.99,
      image: "/images/basketball.jpg",
      description: "Official size and weight basketball for indoor/outdoor use"
    },
    {
      id: 2,
      name: "Soccer Ball",
      price: 24.99,
      image: "/images/soccer.jpg",
      description: "Match quality soccer ball with premium materials"
    },
    {
      id: 3,
      name: "Tennis Racket",
      price: 89.99,
      image: "/images/tennis-racket.jpg",
      description: "Professional grade tennis racket with ergonomic grip"
    },
    {
      id: 4,
      name: "Yoga Mat",
      price: 19.99,
      image: "/images/yoga-mat.jpg",
      description: "Non-slip exercise yoga mat with carrying strap"
    },
    {
      id: 5,
      name: "Dumbbells Set",
      price: 49.99,
      image: "/images/dumbbells.jpg",
      description: "Pair of 5kg rubber-coated dumbbells"
    },
    {
      id: 6,
      name: "Running Shoes",
      price: 79.99,
      image: "/images/running-shoes.jpg",
      description: "Lightweight running shoes with cushioned sole"
    }
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Our Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>${product.price}</strong></p>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;