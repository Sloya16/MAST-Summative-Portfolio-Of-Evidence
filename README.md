# Chef's Menu Manager

A mobile application built with **React Native** and **Expo** that lets a chef manage a restaurant menu. This is the final Portfolio of Evidence (Part 3) for **MAST5112**. It continues the application created in Part 2 and adds editing, deleting, searching, filtering, menu statistics, and a full refactor.

**Student:** Sbusiso <!-- add surname -->
**Student number:** <!-- add student number -->
**Module:** MAST5112 - Mobile Application Development
**Institution:** Rosebank College (The Independent Institute of Education)

## Links

- **GitHub repository:** <!-- paste your repo link here -->
- **Video demonstration (YouTube, Unlisted):** <!-- paste your video link here -->
- **Expo Snack:** <!-- optional: paste your Snack link here -->

---

## Features

### Manage menu items
- **Add** a dish with a name, description, course (Starter, Main Course or Dessert) and price.
- **Edit and update** an existing dish. The form is reused and switches to "Edit Item" mode, with a **Cancel Edit** option.
- **Delete** a dish after a confirmation prompt.
- Every change is reflected in the app immediately.

### Search and filter
- **Search** for a dish by name. The search is not case sensitive.
- **Filter** by course using the All / Starter / Main Course / Dessert buttons.
- The search and the course filter work together.
- A **Clear** button resets the search and the filter and shows every dish again.
- The heading shows how many dishes match, for example "Showing 2 of 5 items".

### Menu statistics
- Total number of menu items.
- Average price of all menu items.
- Number of menu items in each course.
- Shown in a clear card on a dedicated Statistics screen. The statistics always cover the whole menu, not only the filtered items.

### Validation and user feedback
- Dish name is required, must be at least 2 characters, and must be unique (not case sensitive).
- Description is required and must be at least 5 characters.
- Price is required, must be a number, must be greater than 0, and cannot be more than R10 000.
- Invalid fields get a red border and a message directly under the field.
- Success and error messages appear in an on-screen banner that disappears after 3 seconds.

### Navigation
A bottom tab bar gives access to three screens:
1. **Menu** - search, filter, and the list of dishes with Edit and Delete buttons.
2. **Add Item** (becomes **Edit Item** while editing) - the form.
3. **Statistics** - the menu overview.

---

## Technologies

- React Native 0.81
- Expo SDK 54
- React 19
- JavaScript (ES6+), React Hooks (`useState`, `useRef`)

## Project structure

```
App.js                      Main screen logic, state and navigation
constants.js                Shared constants (COURSES list and COLORS palette)
utils.js                    Reusable functions (validation, filtering, statistics, delete confirmation)
components/
  FormField.js              Reusable labelled text input with error message
  CourseSelector.js         Reusable course buttons (form and filter)
  MenuItemCard.js           Card for a single menu item with Edit and Delete
  StatsCard.js              Menu statistics card
  FeedbackBanner.js         Success and error banner
  TabBar.js                 Bottom navigation bar
```

## How to run the app

### Option 1: Expo Snack
Open the Snack link above, then use the **Web**, **Android** or **iOS** preview, or scan the QR code with Expo Go on a phone.

### Option 2: Run locally
1. Install [Node.js](https://nodejs.org/).
2. Clone the repository:
   ```
   git clone <your-repo-link>
   cd <your-repo-folder>
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the app:
   ```
   npx expo start
   ```
5. Scan the QR code with the **Expo Go** app, or press `a` for an Android emulator or `w` for the web.

> Menu items are stored in the app's state, so they reset when the app is reloaded.

---

## Change log (changes since Part 2)

### 1. New functionality

| Requirement | What was added |
|---|---|
| **Manage menu items** | Added **delete** with a confirmation prompt, and **edit and update** by reusing the form. The button changes between "Add Item" and "Update Item", and a Cancel Edit button was added. Changes appear immediately. If the dish being edited is deleted, the form resets. |
| **Search and filter** | Added a name search (not case sensitive), course filter buttons, and a Clear button. The search and the filter combine. A different empty-list message shows when nothing matches. |
| **Menu statistics** | Added total items, average price and items per course. Zero items shows R0.00 instead of `NaN`. |
| **Enhance the application** | See sections 2 and 3 below. |
| **User experience** | See sections 3 and 4 below. |

### 2. Refactoring (what was changed)

**Reusable components** (previously this was repeated code inside `App.js`):

| Component | Replaces | Used |
|---|---|---|
| `FormField` | Repeated label, `TextInput` and error text blocks | Dish name, description, price and search box |
| `CourseSelector` | Course buttons written out inline | Course picker in the form and the course filter |
| `MenuItemCard` | Card markup inside the `FlatList` | Menu list |
| `StatsCard` | New | Statistics screen |
| `FeedbackBanner` | `Alert` success pop-ups | All screens |
| `TabBar` | New | Navigation |

**Reusable functions** (`utils.js`):

| Function | Purpose |
|---|---|
| `validateMenuItem` | Validates the form and returns an object of error messages |
| `filterMenuItems` | Returns the items that match the search text and the selected course |
| `calculateStats` | Calculates total, average price and per-course counts |
| `confirmDelete` | Shows the correct delete confirmation for web and mobile |

**Code organisation:**
- Created `constants.js` for the `COURSES` list and the `COLORS` palette, so colours are no longer repeated in several places.
- Moved the shared styles into the components that use them, so `App.js` only contains screen layout styles.
- Renamed variables and functions to describe what they do (for example `handleSubmit`, `startEdit`, `visibleItems`, `clearFilters`, `resetForm`).
- Replaced `handleAddItem` with one `handleSubmit` function that handles both adding and updating, so the save logic is not duplicated.
- State updates use the functional form (`setMenuItems((current) => ...)`) so they always work from the latest list.

### 3. Validation and feedback improvements
- Price is now stored as a **number** (it was a string in Part 2), which is required for the average price. Price is shown with two decimals (for example R145.00).
- Input is trimmed before saving, so extra spaces are removed.
- Price must be greater than 0 and no more than R10 000. The Part 2 check accepted negative numbers.
- Added minimum lengths for the dish name and description, and a duplicate dish name check.
- Added maximum lengths on the name and description inputs.
- Fields with errors get a red border, and the message appears under the field.
- Replaced the `Alert` success pop-up with an on-screen banner. The Alert did not show in the web preview.

### 4. User experience and layout
- Split the single long page into three screens (Menu, Add/Edit Item, Statistics) with a bottom tab bar.
- After a dish is added or updated, the app returns to the Menu and clears the filters so the dish is visible.
- Pressing Edit opens the form straight away, and the tab label changes to "Edit Item".
- When the menu is empty, an "Add your first item" button leads to the form.
- The feedback banner appears on every screen.
- The active tab is highlighted, and every screen uses the same colours, spacing and button styles from `constants.js`.

### 5. Bugs fixed during development
- **List could not be scrolled** in Part 2 once the form took up the whole screen. The layout was restructured so every screen scrolls properly.
- **Delete confirmation did not work in the web preview** because `Alert` buttons are not supported on web. `confirmDelete` now uses `window.confirm` on web and `Alert.alert` on mobile.
- **Average price crashed to `NaN`** when the menu was empty. This is now handled.
- **Duplicate check wrongly blocked updates** to a dish. The dish being edited is now excluded from the duplicate check.
- **Stale form after deleting** the dish being edited. The form now resets.

---

## Testing checklist

- [x] Add a dish with valid details
- [x] Empty or invalid fields show red borders and messages
- [x] Duplicate dish names are rejected
- [x] Edit and update a dish, and cancel an edit
- [x] Delete a dish, and cancel the confirmation
- [x] Search by name, with different capitalisation
- [x] Filter by each course, and combine with the search
- [x] Clear button resets the search and filter
- [x] Statistics update after adding, editing and deleting
- [x] Statistics show zeros (no `NaN`) when the menu is empty
- [x] Navigation between all three screens
- [x] Tested on the web preview and on Android

## Author

Sbusiso <!-- add surname -->, Higher Certificate in Mobile Application and Web Development, Rosebank College (IIE).
