import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, DocumentData, QuerySnapshot, addDoc, doc, deleteDoc, CollectionReference } from 'firebase/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from '../models/subscription.model'; // Make sure your model is correctly defined
// --- Import collectionData from AngularFire ---
import { collectionData } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private subscriptionsCollection: CollectionReference<DocumentData>;

  constructor() {
    this.subscriptionsCollection = collection(this.firestore, 'subscriptions');
  }

  /**
   * Gets an Observable stream of the current user's subscriptions.
   * Listens for real-time updates.
   */
  getUserSubscriptions(): Observable<Subscription[]> {
    // 1. Get the authentication state (the current user)
    return authState(this.auth).pipe(
      // 2. Switch to a new observable based on the user
      switchMap(user => {
        if (!user) {
          // If no user is logged in, return an empty array observable
          console.log('No user logged in, returning empty subscriptions array.');
          return of([]);
        } else {
          // If a user is logged in, query Firestore for their subscriptions
          console.log('User logged in, fetching subscriptions for:', user.uid);
          const userSubscriptionsQuery = query(
            this.subscriptionsCollection,
            where('userId', '==', user.uid) // Assuming each subscription document has a 'userId' field
          );

          return collectionData(userSubscriptionsQuery, { idField: 'id' }).pipe(
              map(firestoneDataArray => {
                  return firestoneDataArray.map(data => {
                      return {
                          id: data['id'],
                          startDate: (data['startDate'] as any)?.toDate ? (data['startDate'] as any).toDate() : null, // Safely convert Timestamp
                          endDate: (data['endDate'] as any)?.toDate ? (data['endDate'] as any).toDate() : null, // Safely convert Timestamp
                          planId: data['planId'],
                          status: data['status'],
                          dataCap: data['dataCap'],
                          dataUsed: data['dataUsed']
                      } as Subscription;
                  });
              })
          );
        }
      })
    );
  }

  // ... addSubscription and cancelSubscription methods remain the same ...
  /**
   * Adds a new subscription for the current user.
   * @param packageDetails The details of the package being subscribed to.
   * @returns A Promise that resolves when the subscription is added.
   */
  async addSubscription(packageDetails: any): Promise<void> { // Replace 'any' with a proper Package type if you have one
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in to add subscription.');
    }

    // Construct the subscription data object
    const newSubscriptionData = {
      userId: user.uid,
      packageId: packageDetails.id, // Assuming packageDetails has an ID
      startDate: new Date(), // Or a Firestore Timestamp
      // Calculate end date based on package duration
      endDate: new Date(new Date().setMonth(new Date().getMonth() + packageDetails.durationMonths)), // Example calculation
      isActive: true,
      // ... other relevant fields
    };

    // Add the document to the 'subscriptions' collection
    try {
      await addDoc(this.subscriptionsCollection, newSubscriptionData);
      console.log('New subscription added for user:', user.uid);
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error; // Re-throw to be handled by the calling component/logic
    }
  }

  /**
   * Example: Deletes a specific subscription by ID.
   * @param subscriptionId The ID of the subscription document to delete.
   * @returns A Promise that resolves when the subscription is deleted.
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
      const user = this.auth.currentUser;
      if (!user) {
          throw new Error('User not logged in to cancel subscription.');
      }

      // Get a reference to the specific subscription document
      const subscriptionRef = doc(this.subscriptionsCollection, subscriptionId);

      try {
          await deleteDoc(subscriptionRef); // Delete the document
          console.log('Subscription cancelled:', subscriptionId);

      } catch (error) {
          console.error('Error cancelling subscription:', error);
          throw error;
      }
  }

}
