// src/app/components/home/home.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { PlanService } from '../../shared/services/plan.service';
import { AuthService } from '../../shared/services//auth/auth.service'; // Assuming you have this
import { Observable, switchMap, catchError, of, combineLatest } from 'rxjs'; // Need switchMap and combineLatest
import { Subscription } from '../..//shared/models/subscription.model';
import { Plan } from '../../shared/models/plan.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Optional: Define an interface for the combined data structure
interface CurrentSubscriptionDetails {
  subscription: Subscription;
  plan: Plan;
  dataUsagePercentage?: number;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private planService = inject(PlanService);
  private authService = inject(AuthService); // Inject Auth Service

  currentSubscriptionDetails$?: Observable<CurrentSubscriptionDetails | null>;
  // You might still want errorMessage$, though it's often handled by the async pipe
  errorMessage: string | null = null;


  ngOnInit(): void {
    // Get the user ID stream (assuming AuthService provides one)
    const userId$ = this.authService.getCurrentUserStream; // Example: assuming a stream of user IDs

    this.currentSubscriptionDetails$ = userId$.pipe(
      switchMap(userId => {
        if (!userId) {
          // Handle case where user is not logged in
          this.errorMessage = "Please log in.";
          return of(null); // Return null or empty observable
        }
        // Get the user's active subscription(s).
        // Our service is set up to return an array,
        // let's assume we only care about the first active one for the home page.
        const userSubscriptions$ = this.subscriptionService.getUserSubscriptions(); // This returns Observable<Subscription[]>

        return userSubscriptions$.pipe(
           switchMap(subscriptions => {
             const activeSubscription = subscriptions.find(sub => sub.status === 'active'); // Find the active one

             if (!activeSubscription) {
               // User has no active subscription
               return of(null); // Return null to indicate no active subscription
             }

             // Now fetch the plan details using the planId from the active subscription
             const plan$ = this.planService.getPlan(activeSubscription.planId); // Returns Observable<Plan | undefined>

             // Combine the subscription and plan data
             return plan$.pipe(
               switchMap(plan => {
                 if (!plan) {
                   // Plan not found - something is wrong with the data
                   this.errorMessage = "Error: Linked plan not found.";
                   return of(null);
                 }

                 // Create the combined object
                 const combinedDetails: CurrentSubscriptionDetails = {
                   subscription: activeSubscription,
                   plan: plan,
                   dataUsagePercentage: (activeSubscription.dataUsed / activeSubscription.dataCap) * 100 // Example derived data
                 };
                 return of(combinedDetails); // Return the combined details
               }),
               catchError(err => {
                 this.errorMessage = "Error fetching plan details: " + err.message;
                 console.error(err);
                 return of(null);
               })
             );
           }),
           catchError(err => {
             this.errorMessage = "Error fetching subscription details: " + err.message;
             console.error(err);
             return of(null);
           })
        );
      }),
      catchError(err => {
        this.errorMessage = "An unexpected error occurred: " + err.message;
        console.error(err);
        return of(null); 
      })
    );
  }

  // Assuming you have a logout method in your AuthService
  logout(): void {
     this.authService.logout();
    }
}
