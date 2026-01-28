# User Authentication & Appointment System Walkthrough

I have implemented a complete user authentication system, coupled with enhanced appointment management features.

## 1. User Authentication
**Files:** `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`
- **Registration**: Users can sign up with Name, Email, Phone, and Password.
- **Login**: Secure login using JWT tokens stored in LocalStorage.
- **Route Protection**: `App.jsx` now wraps the application in `AuthProvider` and provides a `PrivateRoute` component (used for Dashboard).

## 2. Appointment Booking
**Files:** `frontend/src/components/AppointmentModal.jsx`, `server/controllers/appointmentController.js`
- **Login Enforcement**: The booking modal now checks for authentication. If the user is not logged in, they are prompted to Login or Register before they can view the booking form.
- **Auto-fill**: If logged in, the booking form automatically fills with the user's details.
- **User Linking**: Appointments are now saved with a reference to the `User` ID in the backend.

## 3. User Dashboard
**Files:** `frontend/src/pages/dashboard/UserDashboard.jsx` + sub-components
- **Overview**: Shows a welcome message and quick actions.
- **Future Appointments**: Lists upcoming appointments. Includes a **Reschedule** button.
- **History**: Shows past and completed appointments.
- **Prescriptions**: Users can view their prescriptions directly from the dashboard.

## 4. Rescheduling System
**Files:** `frontend/src/components/dashboard/FutureAppointments.jsx`, `server/models/Appointment.js`, `frontend/src/pages/doctor/PendingRequests.jsx`
- **Request**: Users can request a new date/time for an existing appointment via the dashboard.
- **Validation**: Requests are only allowed if the current appointment is more than **2 hours away**.
- **Doctor Approval**:
    - The Doctor's "Pending Requests" page now displays Reschedule Requests.
    - These are highlighted with a "Reschedule" badge and show the *Requested* time vs the *Original* time.
    - Doctors can **Approve** (updates the appointment time) or **Reject** (keeps original time).

## Verification Steps

### 1. Register and Login
1.  Go to `/register` and create a new account.
2.  You should be redirected to `/dashboard`.
3.  Logout and try to Login via `/login`.

### 2. Book an Appointment
1.  Go to Home page and click "Book Appointment".
2.  If logged out, verify you see the "Login Required" screen.
3.  Login, then open the modal again. Verify your name/email/phone are pre-filled.
4.  Book an appointment.

### 3. Dashboard Check
1.  Go to `/dashboard`.
2.  Check "Upcoming Appointments". You should see the booking you just made.

### 4. Reschedule Flow
1.  In "Upcoming Appointments", click "Reschedule".
2.  Pick a new date/time and submit.
3.  Verify the status shows "Reschedule Pending".
4.  (As Doctor) Go to `/admin/login` (or `/doctor/login` if separate), login as doctor.
5.  Go to "Pending Requests". You should see the reschedule request.
6.  Click "Accept".
7.  (As User) Refresh dashboard. The appointment should now show the *new* time and status "Confirmed".
