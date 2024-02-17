# AngularStarterpack

This is an Angular Boilerplate that can be used to kickstart the development on any Angular project with speed. In the 4 years of working in a service industry, we have built numerous projects and accumulated a lot of learnings from them, that are baked into this boilerplate. Over time, we also noticed certain similarities that repeat themselves in all the projects. We did not necessarily have to re-invent the wheel everytime a new project was started. This boilerplate was all that we would need to get to writing the business logic of the project, the stuff that truly mattered. Using this boilerplate as the base for a project would also force devs to adopt a certian standard set by the boilerplate, thereby ensuring everyone is writing efficient, abstarcted and highly readable code!

In order to set this up:
1 => Change the name of this app from angular-starterpack to whatever you wish to keep.
2 => Have a env folder in your root directory with staging.env and prod.env files in it.
3 => Use your configs whereever there is "YOUR-" prefix.
3 => Run npm install
4 => For staging: npm run start:staging, For prod: npm run start:prod

The boilerplate has/will have the following- 

## Components

1. Linear loader
2. Spinner
3. Pseudo cards (In Progress)
4. Avatar (In Progress)
5. Success/Error Toast Messages (In Progress)
6. Action Buttons (In Progress)
7. Action Modals (In Progress)
8. Error Modals (In Progress)
9. Confirmations Modals

## Directives

1. Limit-to 
2. Search Input 
3. Lazy load images directive 
4. Infinite Scroll 

## Pipes

1. safeHTML 
2. moment parser 
3. join 
4. duration 
5. titlelize 

## Services

1. Authentication (basic scaffolding) (In Progress)
2. User Service (basic scaffolding)
3. Apollo Service
4. Error Service
5. Constants service
6. Validators (In Progress)

## Style components

1. Icon pack (In Progress)
2. Fonts & typography (In Progress)
3. Navbar (In Progress)
4. Animations/Micro interactions (In Progress)
5. Layouts (In Progress)
    1. Grids
    2. Cards
    3. Panels

## Modular Functions

1. DeepCopy 
2. makeDateTime 
3. isObjectEmpty
4. isMobile 
5. getRelativeTime

## Packages
1. @angular/animations
2. @angular/cdk
3. @angular/common
4. @angular/compiler
5. @angular/core
6. @angular/forms
7. @angular/material
    1. mat-form-field
        - In Add New Discount Modal
        - In Add New Account Modal
        - In History Component
        - In Login Component
        - In Forgot Password Component
        - In Reset Password Component
        - In Add New Sub Category Modal
        - In Add New Add On Component
        - In Add New Item Component
        - In Add New Dialog Component
        - In Change Password Modal
        - In User Details Modal
        - In Holiday slots dialog Component
    2. mat-icon
        - In Add new discount modal
        - In View Payouts Component
        - In Add new Account Modal
        - In History Component
        - In Home Component
        - In Login Component
        - In Reset Password Component
        - In Menu Component
        - In Add New Add On Component
        - In Add New Item Component
        - In More Component
        - In Bill Printer Settings Component
        - In Change Password Modal Component
        - In User Details Modal Component
        - In My Orders Component
        - In Confirm Modal Dialog Component
        - In Help Dialog Component
        - In Order Details Dialog Component
    3. mat-tab
        - For All Tabs in More Component
    4. mat-expansion-panel
        - In Menu Component
        - In Help Dialog Component
    5. mat-table
        - To display list in tabular format in Menu Page
    6. mat-datepicker
        - To select date in History Page
        - To select date in Holiday Slots Component
8. @angular/platform-browser
9. @angular/platform-browser-dynamic
10. @angular/router
11. @ng-select/ng-select
    1. To select apply to, discount type in Add new discount modal
    2. To select Category name in Add New Sub Category Modal
    3. To select Group name, veg/non veg/GST inclusive? in Add new add on component
    4. To select Category, sub Category, Item type, veg/non veg, Select Add-Ons Group, Select Add-Ons in Add new Item component
12. @types/googlemaps
13. bootstrap
14. moment
    1. For End Date, Start Date in History TS
    2. For Date , Time in Holiday slots dialog TS
15. ng2-search-filter
16. ngx-bootstrap
17. ngx-material-timepicker
    1. To select Time on Holiday-slots-action-dialog
18. ngx-toastr
    1. Login Page
    2. Forgot Password Page
    3. Bussiness Page-Add New Discount
    4. Bussiness Page-OPT OUT-Remove
    5. Payoutspage-Add New Account
    6. Menu Page-Add Category
    7. Menu Page-Add Subcategory
    8. Menu Page-Add Item
    9. Menu Page-Add Group
    10. Menu Page-Add New Add On
    11. Menu Page-Category, Sub Category, Item Toggle
    12. Outlet Info Page-Change Password
    13. Outlet Info Page-Add New User
    14. Outlet Info Page-Edit User
    15. Logout
