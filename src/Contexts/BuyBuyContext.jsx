import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, where, query, } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function useContextValue() {
    const value = useContext(UserContext);
    return value;
}

export default function BuyBuyContext(props) {

    const { notify } = props;

    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userUID, setUserUID] = useState();
    const [filterBy, setFilterBy] = useState({
        priceRange: 90000,
        options: []
    });


    useEffect(() => {
        (async () => {
            const querySnapshot = await getDocs(collection(db, "Products"));
            const newProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProducts(newProducts);
        })();

        const userUID = localStorage.getItem("userUID");
        setUserUID(userUID)
    }, [])



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

    const logOut = async () => {
        await signOut(auth);
        localStorage.removeItem("userUID");
        setUserUID(null);
    }



    const handleKeyWordFilter = async (e) => {
        const text = e.target.value.toUpperCase();
        const newProducts = await updateSetProducts(filterBy.options, filterBy.priceRange);

        const newFilteredProducts = newProducts.filter((product) =>
            product.category.toUpperCase().includes(text) || product.name.toUpperCase().includes(text) || product.price <= (parseInt(text)))

        setProducts(newFilteredProducts);
    }


    const filterProducts = async (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        const name = e.target.name;
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


    async function updateSetProducts(options, priceRange) {
        let filteredProducts = [];

        // Apply price range filter
        const priceQuerySnapshot = await getDocs(
            query(collection(db, "Products"), where("price", "<=", parseInt(priceRange)))
        );
        filteredProducts = priceQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Apply category filter
        if (options.length > 0) {
            const categoryQuerySnapshot = await getDocs(
                query(collection(db, "Products"), where("category", "in", options))
            );
            const categoryFilteredProducts = categoryQuerySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Merge the category filtered products with the previously filtered products
            filteredProducts = filteredProducts.filter((product) =>
                categoryFilteredProducts.some((item) => item.id === product.id)
            );
        }
        return filteredProducts;
    }


    const addItem = async (item) => {
        if (!userUID) {
            notify("warn", "Please SignIn First");
            return;
        }
        const { id, name, price, image } = item;

        const q = query(collection(db, "User", userUID, "MyCart"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.empty)
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


    const increaseQuantity = async (itemRef, qty) => {
        if (qty === 1) {
            removeFromCart(itemRef);
        } else {
            await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
                qty: qty - 1
            });
        }
    }

    const decreaseQuantity = async (itemRef, qty) => {
        await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
            qty: qty + 1
        });
    }

    const removeFromCart = async (itemRef) => {
        await deleteDoc(doc(db, "User", userUID, "MyCart", itemRef));
    }


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

    return (
        <UserContext.Provider value={{ userUID, setUserUID, products, cartItems, setCartItems, totalPrice, setTotalPrice, notify, filterProducts, handleKeyWordFilter, signUp, signIn, logOut, addItem, increaseQuantity, decreaseQuantity, removeFromCart, purchase }}>
            {props.children}
        </ UserContext.Provider>
    )
}
