import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [textScale, setTextScale] = useState(0.3);
  const [textVisible, setTextVisible] = useState(true);
  const [imgScale, setImgScale] = useState(2);
  const [captionVisible, setCaptionVisible] = useState(false);

  const [secondImgScale, setSecondImgScale] = useState(1.5);
  const [secondCaptionVisible, setSecondCaptionVisible] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);

  const imgRef1 = useRef();
  const captionRef1 = useRef();
  const imgRef2 = useRef();
  const captionRef2 = useRef();
  const productListRef = useRef(); // Ref for the product list

  const featuredProducts = [
    {
      id: 1,
      name: "Professional Basketball",
      price: 29.99,
      image: "/images/basketball.jpg",
    },
    {
      id: 2,
      name: "Soccer Ball",
      price: 24.99,
      image: "/images/soccer.jpg",
    },
    {
      id: 3,
      name: "Tennis Racket",
      price: 89.99,
      image: "/images/tennis-racket.jpg",
    },
    {
      id: 4,
      name: "Yoga Mat",
      price: 19.99,
      image: "/images/yoga-mat.jpg",
    },
    {
      id: 5,
      name: "Dumbbells Set",
      price: 49.99,
      image: "/images/dumbbells.jpg",
    },
    {
      id: 6,
      name: "Running Shoes",
      price: 79.99,
      image: "/images/running-shoes.jpg",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Welcome Text Animation
      const imgRect1 = imgRef1.current?.getBoundingClientRect();
      const scaleRange = 500;
      const newTextScale = scrollTop < scaleRange
        ? 0.3 + (scrollTop / scaleRange) * (5 - 0.3)
        : 5;
      setTextScale(newTextScale);
      setTextVisible(imgRect1?.top > 300);

      // First Image Zoom Out
      const imgVisible = Math.min(Math.max(windowHeight - imgRect1?.top, 0), windowHeight);
      const newImgScale = 1 + ((windowHeight - imgVisible) / windowHeight);
      setImgScale(Math.min(Math.max(newImgScale, 1), 2));

      // First Caption
      const captionTop = captionRef1.current?.getBoundingClientRect().top || 0;
      setCaptionVisible(captionTop < windowHeight * 0.8);

      // Second Image Zoom Out
      const imgRect2 = imgRef2.current?.getBoundingClientRect();
      const secondImgVisible = Math.min(Math.max(windowHeight - imgRect2?.top, 0), windowHeight);
      const newSecondImgScale = 1 + ((windowHeight - secondImgVisible) / windowHeight);
      setSecondImgScale(Math.min(Math.max(newSecondImgScale, 1), 1.5));

      // Second Caption
      const captionTop2 = captionRef2.current?.getBoundingClientRect().top || 0;
      setSecondCaptionVisible(captionTop2 < windowHeight * 1.0);

      // Show/hide second text based on scroll position
      const showSecondTextScrollStart = 2400;
      const showSecondTextScrollEnd = 2900;

      if (scrollTop > showSecondTextScrollStart && scrollTop < showSecondTextScrollEnd) {
        setShowSecondText(true);
      } else {
        setShowSecondText(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '300vh', position: 'relative', paddingBottom: '5%' }}>
      {/* Welcome Text */}
      <h1
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${textScale})`,
          transformOrigin: 'center center',
          transition: 'opacity 0.8s ease',
          opacity: textVisible ? 1 : 0,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 999,
          color: '#000',
        }}
      >
        Welcome to Sports
      </h1>

      {/* Image 1 */}
      <div className="d-flex justify-content-center" style={{ marginTop: '100vh', zIndex: 10 }}>
        <img
          ref={imgRef1}
          src="/home1.jpg"
          alt="Sports Accessories"
          style={{
            maxWidth: '120%',
            height: 'auto',
            transform: `scale(${imgScale})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>

      {/* Caption 1 */}
      <div
        ref={captionRef1}
        style={{
          opacity: captionVisible ? 1 : 0,
          transform: `translateY(${captionVisible ? '0px' : '40px'})`,
          transition: 'all 1s ease',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <h2>Unlock Your Potential with Premium Sports Accessories</h2>
        <p className="text-muted">
          From smart wearables to performance gear, find the tools that push you further and faster.
        </p>
      </div>

      {/* Featured Products */}
      <div className="container-fluid my-5" ref={productListRef}>
        <div className="position-relative">
          <div className="d-flex overflow-auto pb-3" style={{ scrollBehavior: 'smooth' }}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="card mx-2" style={{ minWidth: '250px' }}>
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-primary btn-sm">Add to Cart</button>
                    <Link to={`/products`} className="btn btn-outline-secondary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
            onClick={(e) => {
              const container = e.target.parentElement.querySelector('.overflow-auto');
              container.scrollLeft -= 300;
            }}
            style={{
              zIndex: 2,
              opacity: 0.8,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            ❮
          </button>
          <button
            className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
            onClick={(e) => {
              const container = e.target.parentElement.querySelector('.overflow-auto');
              container.scrollLeft += 300;
            }}
            style={{
              zIndex: 2,
              opacity: 0.8,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Text 2 */}
      <h1
        style={{
          position: 'fixed',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 1s ease',
          opacity: showSecondText ? 1 : 0,
          fontWeight: 600,
          color: '#111',
          zIndex: 998,
          pointerEvents: 'none',
        }}
      >
        Shop Smarter. Play Harder.
      </h1>

      {/* Image 2 */}
      <div className="d-flex justify-content-center" style={{ marginTop: '60vh', zIndex: 10 }}>
        <img
          ref={imgRef2}
          src="/home2.jpg"
          alt="More Accessories"
          style={{
            maxWidth: '90%',
            height: 'auto',
            transform: `scale(${secondImgScale})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>

      {/* Final Caption */}
      <div
        ref={captionRef2}
        style={{
          opacity: secondCaptionVisible ? 1 : 0,
          transform: `translateY(${secondCaptionVisible ? '0px' : '40px'})`,
          transition: 'all 1s ease',
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '1rem',
          color: '#333',
        }}
      >
        <p>Trusted by Athletes, Loved by All</p>
      </div>
    </div>
  );
};

export default Home;
