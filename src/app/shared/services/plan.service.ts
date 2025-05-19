import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, CollectionReference, DocumentData, DocumentSnapshot } from 'firebase/firestore';
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
  getAvailablePlans(): Observable<Plan[]> {
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
  /**
   * Fetches a single plan document from Firestore by its document ID.
   * @param planId The ID of the plan document to fetch (this is the Firestore document ID).
   * @returns An Observable of the Plan data or undefined if a document with that ID is not found.
   */
  getPlanById(planId: string): Observable<Plan | undefined> {
    // 1. Get a reference to the specific document using doc()
    //    doc(firestore instance, collection path string, document ID string)
    const planDocRef = doc(this.firestore, 'packages', planId); // Reference to /packages/{planId}

    // 2. Fetch the document snapshot using getDoc() (returns a Promise)
    const docSnapshotPromise: Promise<DocumentSnapshot<DocumentData>> = getDoc(planDocRef);

    // 3. Convert the Promise to an Observable using 'from'
    return from(docSnapshotPromise).pipe(
      // 4. Map the DocumentSnapshot result to a Plan object
      map(snapshot => {
        if (snapshot.exists()) {
          // If the document exists, get its data and map it to your Plan model
          const data = snapshot.data();
           // Ensure keys match your Firestore document fields
          return {
              id: snapshot.id, // snapshot.id contains the document ID (your planId)
              name: data['name'],
              description: data['description'],
              price: data['price'],
              dataAllowance: data['dataAllowance'],
              duration: data['duration'],
              isActive: data['isActive']
          } as Plan; // Cast to your Plan interface/type
        } else {
          // If the document does not exist with the given ID
          console.log(`No plan document found with ID: ${planId}`);
          return undefined; // Return undefined to indicate it wasn't found
        }
        // The Observable automatically completes after the data is emitted (or undefined is returned)
      })
    );
  }
}
