document.addEventListener('DOMContentLoaded', () => {
    // --- Part A: Course Registration Logic ---

    const courseForm = document.getElementById('courseForm');
    const courseTableBody = document.querySelector('#courseTable tbody');
    const clearDataBtn = document.getElementById('clearDataBtn');

    // State
    let courses = JSON.parse(localStorage.getItem('studentCourses')) || [];

    // Helper: Save content to localStorage
    const saveToStorage = () => {
        localStorage.setItem('studentCourses', JSON.stringify(courses));
    };

    // Helper: Valid Matric Number Format (e.g., LCU/CS/2023/001 or LCU/UG/23/25792)
    // Supports 2 or 4 digit years and 3-6 digit serial numbers
    const isValidMatric = (matric) => {
        const regex = /^[A-Z]+\/[A-Z]+\/\d{2,4}\/\d{3,6}$/i;
        return regex.test(matric);
    };

    // Render Table
    const renderTable = () => {
        courseTableBody.innerHTML = '';

        if (courses.length === 0) {
            courseTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="5">No courses registered yet.</td>
                </tr>
            `;
            return;
        }

        courses.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.studentName}</td>
                <td>${course.matricNumber}</td>
                <td>${course.courseCode}</td>
                <td>${course.courseTitle}</td>
                <td>
                    <button class="delete-btn" onclick="deleteCourse(${index})">
                        Delete
                    </button>
                </td>
            `;
            courseTableBody.appendChild(row);
        });
    };

    // Add Course
    courseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value.trim();
        const matricNumber = document.getElementById('matricNumber').value.trim();
        const courseCode = document.getElementById('courseCode').value.trim();
        const courseTitle = document.getElementById('courseTitle').value.trim();

        // Validation
        if (!studentName || !matricNumber || !courseCode || !courseTitle) {
            showToast('All fields are required.', 'error');
            return;
        }

        if (!isValidMatric(matricNumber)) {
            showToast('Invalid format. Use LCU/CS/2023/001 or LCU/UG/23/25792', 'error');
            return;
        }

        // Create Object
        const newCourse = { studentName, matricNumber, courseCode, courseTitle };

        // Update State
        courses.push(newCourse);
        saveToStorage();
        renderTable();

        // Reset Form
        courseForm.reset();
        showToast('Course registered successfully!', 'success');
    });

    // Delete Course (Global function to be accessible from inline onclick)
    window.deleteCourse = (index) => {
        if (confirm('Are you sure you want to remove this course?')) {
            courses.splice(index, 1);
            saveToStorage();
            renderTable();
            showToast('Course removed.', 'success');
        }
    };

    // Clear All Data
    clearDataBtn.addEventListener('click', () => {
        if (courses.length > 0 && confirm('Are you sure you want to clear all data?')) {
            courses = [];
            saveToStorage();
            renderTable();
            showToast('All data cleared.', 'success');
        }
    });

    // Initial Render
    renderTable();


    // --- Part B: Data Dashboard Logic ---

    const dashboardGrid = document.getElementById('dashboardGrid');
    const refreshApiBtn = document.getElementById('refreshApiBtn');
    const apiStatus = document.getElementById('apiStatus');

    const fetchDashboardData = async () => {
        // Loading State
        dashboardGrid.innerHTML = `
            <div class="loading-skeleton"></div>
            <div class="loading-skeleton"></div>
            <div class="loading-skeleton"></div>
            <div class="loading-skeleton"></div>
        `;
        apiStatus.classList.add('hidden');
        refreshApiBtn.disabled = true;
        refreshApiBtn.innerHTML = '<span class="icon">⌛</span> Loading...';

        try {
            // Using Rest Countries API for visual data
            // Fetching all and taking a random slice to simulate a "Live" dashboard feeling
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,flags,region,capital');

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();

            // Randomly select 8 countries to display (Simulating dynamic data)
            const shuffled = data.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 8);

            renderDashboard(selected);
            showToast('Dashboard data updated', 'success');

        } catch (error) {
            console.error(error);
            dashboardGrid.innerHTML = `<div class="error-message">Failed to load data. Please check your connection.</div>`;
            showToast('Failed to load dashboard data', 'error');
        } finally {
            refreshApiBtn.disabled = false;
            refreshApiBtn.innerHTML = '<span class="icon">↻</span> Refresh Data';
        }
    };

    const renderDashboard = (countries) => {
        dashboardGrid.innerHTML = '';

        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'data-card';

            // Format numbers
            const population = new Intl.NumberFormat().format(country.population);

            card.innerHTML = `
                <div class="country-header">
                    <img src="${country.flags.svg}" alt="${country.name.common} flag" class="flag-img">
                    <div class="country-name">${country.name.common}</div>
                </div>
                <div class="data-row">
                    <span class="data-label">Region:</span>
                    <span class="data-value">${country.region}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Capital:</span>
                    <span class="data-value">${country.capital ? country.capital[0] : 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Population:</span>
                    <span class="data-value">${population}</span>
                </div>
            `;
            dashboardGrid.appendChild(card);
        });
    };

    refreshApiBtn.addEventListener('click', fetchDashboardData);

    // Initial Fetch
    fetchDashboardData();


    // --- Part C: Utilities ---

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icons based on type
        const icon = type === 'success' ? '✅' : '⚠️';

        toast.innerHTML = `
            <span>${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }
});
