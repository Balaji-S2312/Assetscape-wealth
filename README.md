# AssetSphere Dashboard

Create a complete, highly polished, responsive frontend web application called **AssetSphere – Personal Asset Management Dashboard**.

This must be a **frontend-only project**. Do not create, connect, configure, or reference any backend, database, authentication provider, cloud database, serverless function, API key, AI model, or external data service.

## Mandatory technology requirements

Use:

* React
* JavaScript only
* HTML5
* CSS3
* Tailwind CSS if required
* GSAP for animations
* GSAP ScrollTrigger for scroll-based effects
* Recharts or Chart.js for data visualisation
* Lucide React for icons
* React Router for page navigation

Do not use:

* TypeScript
* `.ts` or `.tsx` files
* React Native
* Next.js
* Supabase
* Firebase
* MongoDB
* PostgreSQL
* MySQL
* Prisma
* Spring Boot
* Node.js backend
* Express backend
* Authentication APIs
* External REST APIs
* AI APIs
* API keys
* Serverless functions
* Lovable Cloud backend features

All React component files must use the `.jsx` extension.

## Project objective

Build a visually advanced personal asset and liability management dashboard where users can view, add, edit, filter, and analyse mock financial data.

The application must look like a premium fintech product suitable for a professional software engineering portfolio.

The frontend must be fully interactive using local mock data and React state.

## Application name

**AssetSphere**

Tagline:

**Understand your assets. Control your wealth.**

## Design style

Create a premium modern fintech interface with:

* Dark and light mode
* Glassmorphism
* Soft shadows
* Gradient highlights
* Rounded cards
* Clean typography
* Smooth page transitions
* Animated financial statistics
* Responsive charts
* Interactive tables
* Micro-interactions
* Professional spacing
* Minimal but visually rich layouts

Avoid excessive colours and overly decorative elements.

Use a professional colour system:

* Deep navy or charcoal backgrounds
* White and soft grey surfaces
* Emerald green for positive values
* Red for losses and liabilities
* Blue or violet accents
* Gold accents for premium assets

The application must be fully responsive for:

* Mobile
* Tablet
* Laptop
* Desktop

## Main application structure

Create the following pages:

1. Landing page
2. Login page
3. Registration page
4. Dashboard
5. Assets page
6. Add asset page
7. Asset details page
8. Liabilities page
9. Add liability page
10. Analytics page
11. Transactions page
12. Reports page
13. Profile page
14. Settings page
15. Not-found page

Login and registration are visual frontend simulations only.

Do not connect them to any authentication service.

## Landing page

Create a premium animated landing page containing:

* Responsive navigation bar
* AssetSphere logo
* Hero heading
* Supporting description
* Primary call-to-action button
* Secondary “Explore dashboard” button
* Animated dashboard preview
* Floating asset cards
* Net-worth growth visualisation
* Feature section
* Asset categories section
* Analytics preview
* Security-oriented visual section
* Testimonials using mock content
* Final call-to-action
* Professional footer

Use GSAP animations for:

* Hero text entrance
* Floating cards
* Number counters
* Section reveals
* Parallax effects
* Scroll-triggered animations
* Button hover effects
* Chart entrance animation

Do not overload the page with excessive motion.

## Dashboard layout

Create a reusable responsive dashboard layout containing:

* Collapsible sidebar
* Top navigation bar
* Search field
* Notification icon
* Theme toggle
* User profile menu
* Mobile navigation drawer
* Breadcrumb navigation
* Page title
* Main content area

Sidebar navigation:

* Overview
* Assets
* Liabilities
* Transactions
* Analytics
* Reports
* Profile
* Settings
* Logout

Logout should only redirect to the login page.

## Dashboard overview

Create financial summary cards for:

* Total assets
* Total liabilities
* Current net worth
* Monthly growth
* Total investment value
* Available cash

Add animated counters using GSAP.

Use realistic mock values, for example:

* Total assets: £486,250
* Total liabilities: £112,800
* Net worth: £373,450
* Monthly growth: 4.8%
* Investment value: £168,400
* Available cash: £24,750

Include:

* Net-worth line chart
* Asset allocation doughnut chart
* Asset-versus-liability bar chart
* Monthly income and expenditure chart
* Recent transactions table
* Top-performing assets
* Upcoming liability payments
* Financial health indicator
* Asset growth progress cards

## Assets page

Create an advanced asset-management interface containing:

* Search
* Category filter
* Status filter
* Sort options
* Grid and table view toggle
* Add asset button
* Asset summary cards
* Responsive asset table
* Pagination controls
* Empty-state component
* Delete confirmation modal

Asset categories:

* Property
* Vehicle
* Investment
* Gold
* Cash
* Savings
* Business
* Electronics
* Collectibles
* Other

Each asset must contain:

* ID
* Asset name
* Category
* Purchase value
* Current value
* Purchase date
* Growth percentage
* Status
* Description
* Icon or thumbnail

Use mock data stored locally in JavaScript.

Users must be able to:

* Add an asset
* Edit an asset
* Delete an asset
* Search assets
* Filter assets
* Sort assets
* Open asset details

These actions must update React state only.

No database connection is allowed.

## Add and edit asset form

Create a professional multi-section form with:

* Asset name
* Asset category
* Purchase value
* Current value
* Purchase date
* Ownership percentage
* Asset status
* Description
* Optional image upload preview
* Save button
* Reset button
* Cancel button

Add:

* Frontend validation
* Inline error messages
* Success toast
* Form progress indicator
* Animated field transitions

Do not upload files to any server.

Use `URL.createObjectURL()` or a local preview technique for image preview.

## Asset details page

Show:

* Asset name
* Category
* Purchase value
* Current value
* Profit or loss
* Growth percentage
* Ownership percentage
* Purchase date
* Description
* Performance chart
* Value history
* Edit button
* Delete button
* Back navigation

Use mock historical data.

## Liabilities page

Create liability-management functionality similar to the assets section.

Liability categories:

* Home loan
* Vehicle loan
* Education loan
* Personal loan
* Credit card
* Business loan
* Mortgage
* Other debt

Each liability must contain:

* ID
* Liability name
* Category
* Original amount
* Outstanding balance
* Interest rate
* Monthly payment
* Start date
* Due date
* Status

Allow users to:

* Add
* Edit
* Delete
* Search
* Filter
* Sort
* View details

All operations must remain inside frontend state.

## Analytics page

Create a visually rich analytics page containing:

* Net-worth trend
* Asset allocation
* Liability breakdown
* Monthly asset growth
* Appreciation and depreciation chart
* Investment performance
* Cash-flow chart
* Financial health score
* Asset diversity score
* Debt-to-asset ratio
* Savings ratio
* Monthly comparison cards

Add date filters:

* 7 days
* 30 days
* 6 months
* 1 year
* All time

Changing the filter should update displayed mock chart data.

## Transactions page

Create a frontend transaction-management interface containing:

* Transaction table
* Search
* Filters
* Transaction type selector
* Category filter
* Date filter
* Amount filter
* Add transaction modal
* Edit transaction modal
* Delete confirmation
* Pagination

Transaction types:

* Income
* Expense
* Asset purchase
* Asset sale
* Liability payment
* Investment

Include realistic mock transaction records.

## Reports page

Create financial report cards for:

* Net-worth report
* Asset performance report
* Liability report
* Monthly cash-flow report
* Investment report
* Annual summary

Provide frontend-only buttons for:

* Preview report
* Download report
* Print report

The print button may use `window.print()`.

The download button may generate a simple client-side text, CSV, or JSON file.

Do not connect to a backend.

## Profile page

Include:

* Profile image
* Full name
* Email
* Phone number
* Occupation
* Currency preference
* Country
* Bio
* Edit profile modal

Store changes only in local component state or localStorage.

## Settings page

Include:

* Dark/light mode
* Currency selector
* Language selector
* Notification toggle
* Dashboard layout preference
* Animation preference
* Data privacy section
* Reset mock data button

The currency selector can visually switch between:

* GBP
* INR
* USD
* EUR

Use frontend formatting only.

## Authentication UI

Create:

* Login page
* Registration page
* Forgot-password modal
* Password visibility toggle
* Remember-me checkbox
* Frontend validation
* Success and error messages

Use hard-coded demo credentials:

Email: `demo@assetsphere.com`

Password: `Demo@123`

When the credentials match, redirect to the dashboard.

Do not connect to any authentication provider.

Store only a simple demo login flag in localStorage.

Clearly structure this logic so real authentication can replace it later.

## Mock data architecture

Create separate JavaScript files such as:

* `src/data/assets.js`
* `src/data/liabilities.js`
* `src/data/transactions.js`
* `src/data/chartData.js`
* `src/data/user.js`

Create reusable frontend service abstractions such as:

* `src/services/mockAssetService.js`
* `src/services/mockLiabilityService.js`
* `src/services/mockTransactionService.js`
* `src/services/mockAuthService.js`

These services must use promises and simulated delays so they behave like APIs while still remaining completely local.

Example:

```javascript
export const getAssets = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(mockAssets), 400);
  });
```

Do not use `fetch`, Axios, or external URLs.

## Required reusable components

Create reusable components for:

* Sidebar
* Navbar
* Mobile drawer
* Page header
* Stat card
* Chart card
* Asset card
* Liability card
* Transaction table
* Search input
* Filter dropdown
* Data table
* Modal
* Confirmation dialog
* Toast
* Loader
* Empty state
* Badge
* Theme toggle
* Form field
* Currency display
* Progress bar
* Financial health gauge
* Error boundary

## GSAP animation requirements

Use GSAP carefully and professionally.

Include:

* Route entrance animation
* Dashboard-card stagger animation
* Animated financial counters
* Chart-card reveal
* Sidebar transition
* Modal entrance and exit
* Landing-page ScrollTrigger animations
* Button hover micro-interactions
* Loading-screen animation
* Page-section fade and slide animations

Respect accessibility by detecting reduced-motion preferences.

When reduced motion is enabled, disable non-essential animation.

Ensure GSAP animations are properly cleaned up when components unmount.

Use `gsap.context()` inside React components where appropriate.

## Functional requirements

All important buttons must work.

Users must be able to:

* Navigate between pages
* Log in using demo credentials
* Add mock assets
* Edit mock assets
* Delete mock assets
* Add mock liabilities
* Edit mock liabilities
* Delete mock liabilities
* Add transactions
* Filter and search data
* Toggle dark and light modes
* Change currency display
* Open and close modals
* View charts
* Print reports
* Download local report files
* Update profile information
* Reset mock data

Use localStorage for optional frontend persistence.

Do not create any network request.

## Code-quality requirements

Use:

* Clean folder structure
* Reusable React components
* JavaScript modules
* React hooks
* Context API where useful
* Proper prop handling
* Responsive CSS
* Semantic HTML
* Accessibility labels
* Keyboard-accessible modal controls
* Error boundaries
* Loading and empty states
* Meaningful component names
* Clear comments only where required

Do not put the entire application inside one component.

Avoid duplicated code.

## Suggested folder structure

```text
src/
  assets/
  components/
    common/
    dashboard/
    charts/
    forms/
    layout/
  context/
  data/
  hooks/
  pages/
  services/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Final output requirements

Generate the complete working frontend.

Ensure:

* No TypeScript exists
* No `.ts` files exist
* No `.tsx` files exist
* No database exists
* No backend exists
* No API key exists
* No external API call exists
* No Supabase configuration exists
* No Firebase configuration exists
* No Lovable Cloud dependency exists
* No unfinished placeholder page exists
* No broken navigation exists
* No non-functional primary button exists
* The project runs using standard React commands
* The design is responsive and portfolio-ready

Before completing the project, review the entire codebase and remove any automatically generated backend, database, Supabase, TypeScript, or cloud-integration code.

The final result must be a pure React JavaScript frontend with rich GSAP animations, realistic mock data, functional interactions, and a premium fintech appearance.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a9ce3db9-5117-4936-86af-74a06c39543c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
