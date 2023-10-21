# Small Fixes

This document contains a list of small fixes for the ProShop project. These changes can be found in main repository at https://github.com/bradtraversy/proshop-v2.

## 1. SearchBox Component

Prevent keyword state from being `undefined` when the `urlKeyword` is not set.

Open the `frontend/src/components/SearchBox.js` file and replace the following line:

```js
const [keyword, setKeyword] = useState(urlKeyword);
```

with:

```js
const [keyword, setKeyword] = useState(urlKeyword || '');
```

This will prevent the `keyword` state from being `undefined` when the `urlKeyword` is not set.

## 2. Restrict Uploads to Images Only

Open the `backend/routes/uploadRoutes.js` file

We have a `checkFileType` function that is not being used. Delete that function and replace it with this `fileFilter` function:

```js
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}
```

This will essentially do the same thing as the `checkFileType` function, but it will also check the `mimetype` of the file.

Now delete this code:

```js
const upload = multer({
  storage,
});
```

and replace it with this:

```js
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');
```

This will make sure that the `fileFilter` function is used when uploading a file.

Now replace the `post` route with this:

```js
router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  });
});
```

This will use the `uploadSingleImage` middleware to upload a single image (images only) and return the path to the image.

## 3. Remove Unneeded Dependency

Open the `frontend/package.json` file and remove the `"proshop2": "file:..",` dependency. This should not be here

## 4. Fix custom errors and checking For valid ObjectId

In the `backend/middleware` folder, create a new file called `checkObjectId.js` and add the following code:

```js
import { isValidObjectId } from 'mongoose';

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectId of:  ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
```

This will check if the `req.params.id` is a valid Mongoose ObjectId and throw an error if it is not.

Now in the `backend/middleware/errorMiddleware.js` file, remove the following code as we will not be using it:

```js
// If Mongoose not found error, set to 404 and change message
if (err.name === 'CastError' && err.kind === 'ObjectId') {
  statusCode = 404;
  message = 'Resource not found';
}
```

Now go into the product routes file - `backend/routes/productRoutes.js` and bring the `checkObjectId` function in:

```js
import checkObjectId from '../middleware/checkObjectId.js';
```

We are going to use this in the routes that have an `id` parameter.

```js
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
```

Now if you go to your browser and enter an invalid `id` parameter, such as `http://localhost:3000/product/123`, you should get the following error:

```json
{
  "message": "Invalid ObjectId of:  123"
}
```

## 5. OrderScreen Error Display

There are a few places that are outputting the wrong error message or an error message that does not exist. We need to fix this.

In the `frontend/src/screens/OrderScreen.js` file, replace the error in the message component here:

```js
 return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
```

with:

```js
 return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
```

We want to do this in a few other files as well:

- `frontend/src/screens/PlaceOrderScreen.js`

Replace here:

```js
<ListGroup.Item>
  {error && <Message variant='danger'>{error}</Message>}
</ListGroup.Item>
```

with:

```js
<ListGroup.Item>
  {error && <Message variant='danger'>{error.data.message}</Message>}
</ListGroup.Item>
```

- `frontend/src/screens/admin/ProductEditScreen.js`

Replace here:

```js
 {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
```

with:

```js
 {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
```

- `frontend/src/screens/admin/ProductListScreen.js`

Replace here:

```js
  {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
```

with:

```js
 {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
```

This will fix any wrong error messages.

## 6. User inherits the last user's cart and shipping

Right now, if a user logs out and another user logs in, the new user will inherit the last user's cart and shipping address. We need to fix this by making sure that it is cleared when a user logs out.

Go to the `frontend/src/slices/authSlice.js` file and replace the following code:

```js
localStorage.removeItem('userInfo');
localStorage.removeItem('expirationTime');
```

with:

```js
localStorage.clear();
```

Then go to the `frontend/slices/cartSlice.js` file and add a new `resetCart` reducer:

```js
  // ..
  clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
  resetCart: (state) => (state = initialState), // Add this line
```

export it:

```js
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart, // Add this line
} = cartSlice.actions;
```

Now go to the header component at `frontend/src/components/Header.js` and import the `resetCart` action:

```js
import { resetCart } from '../slices/cartSlice';
```

Then dispatch the `resetCart` action when the user logs out:

```js
const logoutHandler = async () => {
  try {
    await logoutApiCall().unwrap();
    dispatch(logout());
    dispatch(resetCart()); // Add this line
    navigate('/login');
  } catch (err) {
    console.error(err);
  }
};
```
