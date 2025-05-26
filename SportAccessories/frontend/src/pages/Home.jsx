import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = ({ addToCart }) => {
  const navigate = useNavigate();
  const [textScale, setTextScale] = useState(0.3);
  const [textVisible, setTextVisible] = useState(true);
  const [imgScale, setImgScale] = useState(2);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [secondImgScale, setSecondImgScale] = useState(1.5);
  const [secondCaptionVisible, setSecondCaptionVisible] = useState(false);

  const [middleTextVisible, setMiddleTextVisible] = useState(false);

  const imgRef1 = useRef();
  const captionRef1 = useRef();
  const imgRef2 = useRef();
  const captionRef2 = useRef();
  const productListRef = useRef();
  const middleTextRef = useRef();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/products');
      // Only show first 6 products as featured
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      const imgRect1 = imgRef1.current?.getBoundingClientRect();
      const scaleRange = 500;
      const newTextScale = scrollTop < scaleRange
        ? 0.3 + (scrollTop / scaleRange) * (5 - 0.3)
        : 5;
      setTextScale(newTextScale);
      setTextVisible(imgRect1?.top > 300);

      const imgVisible = Math.min(Math.max(windowHeight - imgRect1?.top, 0), windowHeight);
      const newImgScale = 1 + ((windowHeight - imgVisible) / windowHeight);
      setImgScale(Math.min(Math.max(newImgScale, 1), 2));

      const captionTop = captionRef1.current?.getBoundingClientRect().top || 0;
      setCaptionVisible(captionTop < windowHeight * 0.8);

      const imgRect2 = imgRef2.current?.getBoundingClientRect();
      const secondImgVisible = Math.min(Math.max(windowHeight - imgRect2?.top, 0), windowHeight);
      const newSecondImgScale = 1 + ((windowHeight - secondImgVisible) / windowHeight);
      setSecondImgScale(Math.min(Math.max(newSecondImgScale, 1), 1.5));

      const captionTop2 = captionRef2.current?.getBoundingClientRect().top || 0;
      setSecondCaptionVisible(captionTop2 < windowHeight * 1.0);

      const middleTextTop = middleTextRef.current?.getBoundingClientRect().top || 0;
      setMiddleTextVisible(middleTextTop < windowHeight * 0.8);
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
              <div key={product._id} className="card mx-2" style={{ minWidth: '250px' }}>
                <img
                  src={`http://localhost:5050${product.imageUrl}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price.toFixed(2)}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={async () => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          navigate('/login');
                          return;
                        }
                        const success = await addToCart(product);
                        if (!success) {
                          navigate('/login');
                        }
                      }}
                    >
                      Add to Cart
                    </button>
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

      {/* Middle Text */}
      <div
        ref={middleTextRef}
        style={{
          textAlign: 'center',
          marginTop: '4vh',
          opacity: middleTextVisible ? 1 : 0,
          transform: `translateY(${middleTextVisible ? '0px' : '30px'})`,
          transition: 'opacity 1s ease, transform 1s ease',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#222',
        }}
      >
        Shop Smarter. Play Harder.
      </div>

      {/* Image 2 */}
      <div className="d-flex justify-content-center" style={{ marginTop: '20vh', zIndex: 10 }}>
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
