import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, CollectionReference, DocumentData } from 'firebase/firestore';
import { Observable, from } from 'rxjs'; // Using 'from' to convert Promise to Observable
import { map } from 'rxjs/operators';
import { Plan } from '../models/plan.model'; // You'll need a model interface/class for a Package

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private firestore: Firestore;
  private packagesCollection: CollectionReference<DocumentData>;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
    // Set up a reference to the packages collection
    this.packagesCollection = collection(this.firestore, 'packages');
  }

  /**
   * Gets a list of all available packages.
   * @returns An Observable of an array of Packages.
   */
  getAvailablePackages(): Observable<Plan[]> {
    // getDocs fetches the data once, use onSnapshot if you need real-time updates here too
    const querySnapshotPromise = getDocs(this.packagesCollection);

    // Convert the Promise to an Observable
    return from(querySnapshotPromise).pipe(
        map(snapshot => {
            // Map the documents to your Package model
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data['name'],
                    description: data['description'],
                    price: data['price'],
                    dataAllowance: data['dataAllowance'],
                    duration: data['duration'],
                    isActive: data['isActive']
                } as Plan;
            });
        })
    );
  }
}