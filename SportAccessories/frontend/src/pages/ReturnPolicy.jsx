import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="container my-5">
      <h1 className="mb-4">Return Policy</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4">30-Day Return Window</h2>
          <p className="card-text">
            We offer a 30-day return window for most items. Products must be returned in their original condition 
            with all tags attached and original packaging.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4">Eligible Items</h2>
          <ul className="list-unstyled">
            <li>✓ Unused sports equipment</li>
            <li>✓ Unworn athletic wear</li>
            <li>✓ Unopened accessories</li>
            <li>✗ Personal hygiene items</li>
            <li>✗ Custom-made equipment</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4">Return Process</h2>
          <ol className="mb-0">
            <li>Initiate return through your account or contact customer service</li>
            <li>Receive return shipping label via email</li>
            <li>Package item securely with original packaging</li>
            <li>Drop off at authorized shipping location</li>
            <li>Refund processed within 5-7 business days after receipt</li>
          </ol>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4">Refund Options</h2>
          <ul className="list-unstyled mb-0">
            <li>• Original payment method refund</li>
            <li>• Store credit (additional 5% bonus)</li>
            <li>• Exchange for another item</li>
          </ul>
        </div>
      </div>

      <div className="alert alert-info">
        <h3 className="h5">Need Help?</h3>
        <p className="mb-0">
          Contact our customer service team at support@sportaccessories.com or call +91 8105238129
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;