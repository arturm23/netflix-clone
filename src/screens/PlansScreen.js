import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import "./PlansScreens.css"
import {loadStripe} from "@stripe/stripe-js"

function PlansScreen() {
    const user = useSelector(selectUser);
    const [products, setProducts ]= useState([]);
    const [subscribtion, setSubscribtion] = useState(null);

    useEffect(() => {
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach( async subscribtion => {
                setSubscribtion({
                    role: subscribtion.data().role,
                    current_period_end: subscribtion.data().current_period_end.seconds,
                    current_period_start: subscribtion.data().current_period_start.seconds,
                })
            })
        })

    },[])

    useEffect(() => {
        db.collection('products')
        .where('active', '==', true)
        .get()
        .then((querySnapshot) => {
                const products = {};
                querySnapshot.forEach(async (productDoc) => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await productDoc.ref.collection('prices').get();
                    priceSnap.docs.forEach((price) => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data(),
                        }
                    })
                })
                setProducts(products);
            });
    }, [])
    console.log(products)

    const loadCheckout = async (priceId) => {
        const docRef = await db.collection('customers')
        .doc(user.uid)
        .collection('checkout_sessions')
        .add({
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        });
        docRef.onSnapshot(async(snap) => {
            const { error, sessionId} = snap.data();

            if(error){
                alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
                const stripe = await loadStripe("pk_test_51M3VsYLqdlM8oooSe5rUhvJWHJV5tkHGPMOGNBGI3VJtjUC3j5eLrrNuQ6rC7hCClGXJwzYPRVV8XTKiJ295MBDG00CjDDTBzV")
                stripe.redirectToCheckout({sessionId})
            }
            
        })
    };
  return (
    <div className='plansScreen'>
        {subscribtion && ( 
        <p>Renewal date:{" "} 
        {new Date(
            subscribtion?.current_period_end * 1000
            ).toLocaleDateString()} 
            </p> 
            )}
        {Object.entries(products).map(([productId, productData]) => {
            const isCurrentPackage = productData.name?.toLowerCase().includes(subscribtion?.role);
            return (
                <div key = {productId} className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`}>
                    <div className='plansScreen__info'>
                        <h5>{productData.name}</h5> 
                        <h6>{productData.description}</h6>
                    </div>
                    <button
                    onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}
                    > 
                        {isCurrentPackage ? "Current Plan" : "Subcribe"}
                    </button>
                </div>
            )
        })}
    </div>
  )
}

export default PlansScreen