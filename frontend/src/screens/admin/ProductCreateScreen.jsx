import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [createProduct, { isLoading: loadingUpdate }] = useCreateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();
  const { userInfo: user } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct({
          name,
          price,
          user,
          image,
          brand,
          category,
          description,
          countInStock,
        }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
        toast.success('Product created');
        navigate('/admin/productlist');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create New Product</h1>
        {loadingUpdate && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
            <Form.Control label="Choose File" onChange={uploadFileHandler} type="file"></Form.Control>
            {loadingUpload && <Loader />}
          </Form.Group>

          <Form.Group controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control type="number" placeholder="Enter countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" style={{ marginTop: '1rem' }}>
            Create new Product
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
