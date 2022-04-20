import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./config";
import React , { useEffect, useState, useRef } from 'react';
import defaultAvatar from 'images/defaultAvatar.png';
import defaultBanner from 'images/defaultBanner.jpg';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password, fullname) => {
    console.log("FIREBASE AUTH")
          this.auth.createUserWithEmailAndPassword(email , password)
          .then((userCredential)=>{
              // send verification mail.
            userCredential.user.sendEmailVerification();
            
            // auth.signOut();
            alert("Verification Email sent");
            console.log("USER ID " + userCredential.user.uid + " " + userCredential.uid)
            // resolve(userCredential.user.uid)
            const fname = fullname.split(' ').map((name) => name[0].toUpperCase().concat(name.substring(1))).join(' ');
            const user = {
              fname,
              avatar: defaultAvatar,
              banner: defaultBanner,
              email: email,
              address: '',
              basket: [],
              mobile: { data: {} },
              role: 'USER',
              dateJoined: new Date().getTime(),
            };
            this.addUser(userCredential.user.uid, user)
          })
          .catch(alert);
        
  }

  signIn = (email, password) => {
    console.log("FIREBASE SIGNIN")
    
    this.auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("FIREBASE SIGNIN "  + user + " " + user.emailVerified)
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
      reject(error)
      console.log("FIREBASE SIGNIN "  + errorCode + " " + errorMessage)
    });;
  }

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => { 
    console.log("ADDUSER " + id);
    this.db.collection("users").doc(id).set(user); }

  getUser = (id) => this.db.collection("users").doc(id).get();

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

    generateReferalCode = (code) => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            var code = "REFERPILK"
            if (this.auth.currentUser.displayName) {
              code = this.auth.currentUser.displayName.split(" ")[0].toUpperCase() + "-PILK"
            }
            console.log("CODE " + code)
            const query = this.db.collection("coupons")
              .where("code",">=",code)
              .where("code", "<", code + "1000");
  
            const snapshot = await query.get();
            
            if (snapshot.docs.length > 0) {
              
              const ref_query = this.db.collection("users").doc(this.auth.currentUser.uid);
              console.log("CODE 2 " + snapshot.docs.length +" " + this.auth.currentUser.uid)
              const snap = await ref_query.get();
              console.log("CODE 2 snap " + snap.data()["referral_id"])
              if(snap.data()["referral_id"] != undefined ) {
                console.log("CODE 2 snap null")
                resolve(null);
              } else {
                console.log("CODE 2 snap set code")
                const coupon = {"code": code + snapshot.docs.length}
                coupon["discount"] = 10
                coupon["discount_type"]= "pc"
                coupon["type"] = "user_referral"
                coupon["user_id"] = this.auth.currentUser.uid
                coupon["max_users"] = 5
                coupon["referral_pc"] = 20
                this.db.collection("coupons").add(coupon).then((docRef) => {
                  this.db.collection("users").doc(this.auth.currentUser.uid)
                  .update({"referral_id": docRef.id})
                  resolve(coupon["code"]);
                })
              }
            } else {
              console.log("CODE 3 null")
              const coupon = {"code": code}
              coupon["discount"] = 10
              coupon["discount_type"]= "pc"
              coupon["type"] = "user_referral"
              coupon["user_id"] = this.auth.currentUser.uid
              coupon["max_users"] = 5
              coupon["referral_pc"] = 20
              this.db.collection("coupons").add(coupon).then((docRef) => {
                this.db.collection("users").doc(this.auth.currentUser.uid)
                .update({"referral_id": docRef.id})
                resolve(coupon["code"]);
              })
              
            }
          } catch (e) {
            reject(e?.message || ":( Failed to fetch coupon.");
          }
        })();
      })
    }

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id) => this.db.collection("products").doc(id).get();

  getOrders = () => this.db
      .collection("orders")
      .orderBy("fulfillment_ts", "desc")
      .startAt(Date.now())
      .limit(100)
      .get();

      // .orderBy("fulfillment_ts", "desc")
      // .startAt(Date.now())
      // .limit(100)

  getCheckouts = () => this.db
      .collection("checkouts")
      .orderBy("created_date", "desc")
      .startAt(Date.now())
      .limit(100)
      .get();

  applyCoupon = (code) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          
          const query = this.db.collection("coupons")
            .where("code","==",code["code"]);

          const snapshot = await query.get();

          if (snapshot.docs.length > 0) {
            const data = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
            resolve(data);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e?.message || ":( Failed to fetch coupon.");
        }
      })();
    })
  }

  checkValidCoupon = (coupon) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if(coupon["type"] == "single_use" || coupon["type"] == "user_referral") {
            const query = this.db.collection("users").doc(this.auth.currentUser.uid).collection("coupons").doc(coupon["id"])

            const snapshot = await query.get();

            console.log("COUPON " + coupon["code"])

            if (snapshot.exists) {
              const data = {"status": "invalid"}
              resolve(data);
            } else {
              const data = {"status": "valid"}
              resolve(data);
            }
          } else if (coupon["type"] == "diet_referral") {
            const data = {"status": "valid"}
            resolve(data);
          }
        } catch (e) {
          reject(e?.message || ":( Failed to fetch coupon.");
        }
      })();
    })
  }

  setCouponForUser = (id, coupon) => {
    this.db.collection("users").doc(this.auth.currentUser.uid).collection("coupons").doc(id).set(coupon)
  }

  // applyCoupon = async (code) => {
  //   const query = this.db.collection("coupons")
  //           .where("code","==",code);

  //         const snapshot = await query.get();
  //         console.log("CODE 1  " + snapshot)
  //         if(snapshot.docs.length > 0) {
  //           const code = { id: doc.id, ...doc.data() }
  //           console.log("CODE  " + code)
  //           return(code)
  //         } else {
  //           return(null)
  //         }

  // };


  

  getProducts = (lastRefKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .startAfter(lastRefKey)
              .limit(12);

            const snapshot = await query.get();
            const products = [];
            snapshot.forEach((doc) =>
              products.push({ id: doc.id, ...doc.data() })
              
            );
            
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey });
          } catch (e) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const totalQuery = await this.db.collection("products").get();
            const total = totalQuery.docs.length;
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .limit(12);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products = [];
              snapshot.forEach((doc) =>
                products.push({ id: doc.id, ...doc.data() })
              );
              const lastKey = snapshot.docs[snapshot.docs.length - 1];

              resolve({ products, lastKey, total });
            }
          } catch (e) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          // const totalResult = await totalQueryRef.get();
          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();
          // const total = totalResult.docs.length;

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            // MERGE PRODUCTS
            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });

            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isFeatured", "==", true)
      .limit(itemsCount)
      .get();

  getRecommendedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isRecommended", "==", true)
      .limit(itemsCount)
      .get();

  addProduct = (id, product) =>
    this.db.collection("products").doc(id).set(product);


  dupProduct = (product) => {
		this.db.collection("products").doc("pilk-original").set(product)
  }


  generateKey = () => this.db.collection("products").doc().id;

  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();

  // -- Order Actions -- //

  createCheckout = (id, order) =>
    this.db.collection("checkouts").doc(id).set(order)

  createOrder = (id, order) => {
    this.db.collection("orders").doc(id).set(order)

    if(this.auth.currentUser) {
      this.db.collection("users").doc(this.auth.currentUser.uid).collection("orders").doc(id).set(order)
    }
  }

  setOrderForUser = (id, userId, order) => {
    this.db.collection("users").doc(userId).collection("orders").doc(id).set(order)
  }

  sendEmail = (id, mail) =>
    this.db.collection("mail").doc(id).set(mail)

}

const firebaseInstance = new Firebase();

export default firebaseInstance;
