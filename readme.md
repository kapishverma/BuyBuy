# Authentication and User-Management

## SignUp
SignUp form that allows new users to register using their email address and a password. When a user submits the form, validate the email address and password provided by the user, then pass them to the createUserWithEmailAndPassword method:
then, at same i update new user's displayName

```javascript
    const signUp = async (name, email, password) => {
        return new Promise(async (resolve, reject) => {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async () => {
                    await updateProfile(auth.currentUser, {
                        displayName: name
                    })
                    notify("success", `Congratulations ${name}, your account has been successfully created`);
                    resolve(true);
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    notify("error", errorMessage)
                    resolve(false);
                });
        })
    }

```


## SignIn
SignIn form that allows existing users to sign in using their email address and password. When a user completes the form, call the signInWithEmailAndPassword method:
```javascript

    const signIn = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                const user = auth.currentUser;
                localStorage.setItem("userUID", user.uid);
                setUserUID(user.uid);
                notify("success", `Login Successful,👋🏼 hii ${user.displayName}`);
                return true;
            })
            .catch((error) => {
                const errorMessage = error.message;
                notify("error", errorMessage)
                return false;
            });
         }
```
## SignOut / LogOut

```javascript
    const logOut = async () => {
        await signOut(auth);
        localStorage.removeItem("userUID");
        setUserUID(null);
    }

```
# Filtering Results
## Take User Filtring preference from input Type range and checkBox

Here i take user input,then filter and update products result on the basic of user preference, such as price, type

```javascript
    const filterProducts = async (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        // this value if either bollean(from checkBox) or number(from price seekBar)

        const name = e.target.name;//i check which element is changed ,by element name
        if (value && name === "seekbar") {
            setFilterBy((prevState) => ({
                ...prevState,
                priceRange: value
            }));
            const newProducts = await updateSetProducts(filterBy.options, value);
            setProducts(newProducts);

        } else if (value) {
            setFilterBy((prevState) => ({
                ...prevState,
                options: [...prevState.options, name]
            }));
            const newProducts = await updateSetProducts([...filterBy.options, name], filterBy.priceRange);
            setProducts(newProducts);

        } else {
            setFilterBy((prevState) => ({
                ...prevState,
                options: prevState.options.filter((option) => option !== name)
            }));
            const newProducts = await updateSetProducts(filterBy.options.filter((option) => option !== name), filterBy.priceRange);
            setProducts(newProducts);

        }
    };
```
## Take User Filtring preference from input Type text(string or number);
if you type any number it will search product with price less then or equal to that number,
if you type any text then it will search on the basic of product name and its category

```javascript
    const handleKeyWordFilter = async (e) => {
        const text = e.target.value.toUpperCase();
        const newProducts = await updateSetProducts(filterBy.options, filterBy.priceRange);

        const newFilteredProducts = newProducts.filter((product) =>
            product.category.toUpperCase().includes(text) || product.name.toUpperCase().includes(text) || product.price <= (parseInt(text)))

        setProducts(newFilteredProducts);
    }
```
## Filter Product on the basic of price / category

this function `updateSetProducts` is a helper function it will used by  `filterProducts` and `handleKeyWordFilter`, here i fiest fetch product on the basic of price and category ,then filter(compair) them locally on the basic of category selected by user

```javascript

    async function updateSetProducts(options, priceRange) {
        let filteredProducts = [];

        const priceQuerySnapshot = await getDocs(
            query(collection(db, "Products"), where("price", "<=", parseInt(priceRange)))
        );

        filteredProducts = priceQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (options.length > 0) {
            const categoryQuerySnapshot = await getDocs(
                query(collection(db, "Products"), where("category", "in", options))
            );
            const categoryFilteredProducts = categoryQuerySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            filteredProducts = filteredProducts.filter((product) =>
                categoryFilteredProducts.some((item) => item.id === product.id)
            );
        }
        return filteredProducts;
    }
```

# Add Item in Cart
 here i add full data of product to user's cart when he add something to its cart, with an extra key-value pair qty:1, which denotes the number of quantity of particular product,you can increase quantity from cart page.
```javascript

    const addItem = async (item) => {
        if (!userUID) {
            notify("warn", "Please SignIn First");
            return;
        }
        const { id, name, price, image } = item;

        const q = query(collection(db, "User", userUID, "MyCart"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(collection(db, "User", userUID, "MyCart"), {
                id,
                name,
                price,
                image,
                qty: 1
            }).then(() => {
                notify("success", "Item Has Been Added Successfully")
            })
        } else {
            notify("warn", "Cart m pahle se hi h bhai")
        }
    }
```
## Increase Quantity of a Particular Product, in Cart
```javascript

    const increaseQuantity = async (itemRef, qty) => {
        if (qty === 1) {
            removeFromCart(itemRef);
        } else {
            await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
                qty: qty - 1
            });
        }
    }
```
## Decrease Quantity of a Particular Product, in Cart

```javascript
    const decreaseQuantity = async (itemRef, qty) => {
        await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
            qty: qty + 1
        });
    }
```
## Remove Particular Product from Cart

```javascript
    const removeFromCart = async (itemRef) => {
        await deleteDoc(doc(db, "User", userUID, "MyCart", itemRef));
    }

```
# Purchase all item in Cart
here i delete items one by one from user's cart and then add it to its MyOrder collection
```javascript
    const purchase = async () => {

        const querySnapshot = await getDocs(collection(db, "User", userUID, "MyCart"));
        if (querySnapshot.empty) {
            notify("error", "Your Cart is Empty")
            return;
        }

        const allItemsInMyCart = [];

        querySnapshot.forEach((doc) => {
            const { name, price, qty } = doc.data();
            allItemsInMyCart.push({ name, price, qty });
            removeFromCart(doc.id);
        })
        const today = new Date();
        const day = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        await addDoc(collection(db, "User", userUID, "MyOrders"), {
            purchaseDate: day,
            itemsList: allItemsInMyCart
        });
        setCartItems([]);
        setTotalPrice(0);
    }
```