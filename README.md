Library Management System
A robust digital platform designed to automate book circulation, inventory oversight, and administrative workflows for modern libraries.

🚀 Key Features
Intelligent Circulation: Automated workflow for borrowing and returning books with student/member record tracking.

Dynamic Fine Engine: Real-time calculation of overdue fines based on customizable daily rates.

Inventory Management: Status-based stock updates (Returned, Damaged, or Lost) to ensure data integrity.

The Library Vault: An intuitive, alphabetically organized discovery interface for seamless book browsing.

Admin Analytics Dashboard: A high-level overview for librarians featuring real-time overdue alerts and defaulter tracking.

Secure Authentication: Role-based access control (Admin/Staff) using BCrypt encryption.

🛠️ System Architecture
The project follows a decoupled client-server architecture:

Frontend: React-based Single Page Application (SPA) utilizing Bootstrap for responsive design.

Backend: Spring Boot REST API handling business logic and security.

Database: MySQL relational database for persistent storage of users, books, and transaction records.

📖 Setup & Installation
Prerequisites
Java 17+

Node.js (v16+)

MySQL Server

Backend Setup
Navigate to the /backend folder.

Update src/main/resources/application.properties with your MySQL credentials.

Run the application using Maven:

Bash
mvn spring-boot:run
Frontend Setup
Navigate to the /frontend folder.

Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev

🔐 Credentials (Demo)
By default, the system requires a registered account. New users are assigned the ADMIN role for full system access during development.

URL: http://localhost:5173

Default API Port: 8081

📊 Database Schema
The system utilizes a relational schema involving:

user_data: Stores credentials and roles.

books: Stores inventory and stock count.

borrow_records: Tracks loan history and fine status.

library_cards: Links members to their borrowing privileges.

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any logic improvements or UI enhancements.
