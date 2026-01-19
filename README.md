# Student Course Registration & Data Dashboard

This project is a web-based application that combines a student course registration system with a live data dashboard. It demonstrates core frontend development skills including DOM manipulation, form validation, localStorage persistence, and API consumption.

## 🚀 How to Run
1. Simply open the `index.html` file in any modern web browser.
2. No server installation is required.

## 🎯 Features

### Part A: Course Registration
- **Form Validation**: Ensures all fields are filled and checks the Matric Number format (e.g., `LCU/CS/2023/001`).
- **Data Persistence**: Uses `localStorage` so your registered courses are saved even if you refresh the page.
- **Management**: View registered courses in a table and delete them if needed.

### Part B: Global Data Dashboard
- **Live API Data**: Fetches real-time country data from the [Rest Countries API](https://restcountries.com/).
- **Dynamic Display**: Shows flags, population, capital, and region for random countries.
- **User Feedback**: Includes loading skeletons and error handling states.
- **Refresh Capability**: Reload new data sets with a click of a button.

## 🎨 Design
- **Glassmorphism**: Modern, translucent card design.
- **Responsiveness**: Fully functional on mobile and desktop devices.
- **Aesthetics**: Premium color palette and smooth micro-interactions.

## 📁 Structure
- `index.html`: Structure (HTML5)
- `style.css`: Styling (Vanilla CSS)
- `script.js`: Logic (Vanilla JS)
