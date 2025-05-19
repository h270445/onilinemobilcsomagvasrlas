import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  DocumentData,
  addDoc,
  doc,
  deleteDoc,
  CollectionReference
} from 'firebase/firestore';

import { Auth, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Subscription } from '../models/subscription.model';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private firestore: Firestore;
  private auth: Auth;
  private subscriptionsCollection: CollectionReference<DocumentData>;

  constructor(firestore: Firestore, auth: Auth) { // Standard constructor injection
    this.firestore = firestore;
    this.auth = auth;
    console.log('SubscriptionService constructor: Firestore injected?', !!this.firestore);
    console.log('SubscriptionService constructor: Auth injected?', !!this.auth);

    this.subscriptionsCollection = collection(this.firestore, 'subscriptions');
  }

  getUserSubscriptions(userId: string): Observable<Subscription[]> {
    console.log('Fetching subscriptions for user ID:', userId);
    const userSubscriptionsQuery = query(
      this.subscriptionsCollection,
      where('userId', '==', userId)
    );
    return collectionData(userSubscriptionsQuery, { idField: 'id' }).pipe(
      map(firestoneDataArray => {
        console.log(`Received ${firestoneDataArray.length} subscriptions for user ${userId}`);
        return firestoneDataArray.map(data => ({
          id: data['id'],
          startDate: (data['startDate'] as any)?.toDate ? (data['startDate'] as any).toDate() : null,
          endDate: (data['endDate'] as any)?.toDate ? (data['endDate'] as any).toDate() : null,
          planId: data['planId'],
          status: data['status'],
          dataCap: data['dataCap'],
          dataUsed: data['dataUsed']
        } as Subscription));
      })
    );
  }

  async addSubscription(userId: string, packageDetails: any): Promise<void> {
      if (!this.auth.currentUser || this.auth.currentUser.uid !== userId) {
          throw new Error('Authenticated user does not match userId for adding subscription.');
      }
      const newSubscriptionData = { userId: userId, packageId: packageDetails.id, startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + packageDetails.durationMonths)), isActive: true, };
      try {
          await addDoc(this.subscriptionsCollection, newSubscriptionData);
          console.log('New subscription added for user:', userId);
      } catch (error) {
          console.error('Error adding subscription:', error);
          throw error;
      }
  }

  async cancelSubscription(userId: string, subscriptionId: string): Promise<void> {
       if (!this.auth.currentUser || this.auth.currentUser.uid !== userId) {
           throw new Error('Authenticated user does not match userId for canceling subscription.');
       }
       const subscriptionRef = doc(this.subscriptionsCollection, subscriptionId);
       try {
           await deleteDoc(subscriptionRef);
           console.log('Subscription cancelled:', subscriptionId);
       } catch (error) {
           console.error('Error cancelling subscription:', error);
           throw error;
       }
   }
}
