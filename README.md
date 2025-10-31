## Overview

SBORR (Sangguniang Bayan Ordinance and Resolution Repository) is a web-based system designed to manage and archive ordinances and resolutions from the Sangguniang Bayan (Municipal Council) in Philippine local governments. This repository facilitates digital storage, search, and retrieval of legal documents, enhancing transparency and efficiency in local governance.

The project is built using modern web technologies to provide a user-friendly interface for uploading, categorizing, and accessing documents. It aims to digitize traditional processes and ensure easy compliance with local regulations.

## Features

- **Document Management**: Upload, edit, and organize ordinances and resolutions .
- **Session Management**: Schedule a session for a legislative agenda.
- **Search Functionality**: Quickly find documents by keywords, dates, or categories.
- **User Authentication**: Secure login for administrators and authorized users.
- **Responsive UI**: Works on desktop and mobile devices.
- **Audit Logs**: Track changes and access history for accountability.

## Technologies Used

- **Frontend**: HTML, CSS, Typescript, React
- **Backend**: Node.js with supabase
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Vercel

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/uncleedev/sborr.git
   cd sborr
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Add necessary variables (e.g., database URL, JWT secret):
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     VITE_EMAILJS_SERVICE_ID
     VITE_EMAILJS_PUBLIC_KEY
     VITE_EMAILJS_TEMPLATE_ID
     VITE_EMAILJS_TEMPLATE_SESSION
     VITE_EMAILJS_SERVICE_ID_INVITED
     VITE_EMAILJS_PUBLIC_KEY_INVITED
     VITE_EMAILJS_TEMPLATE_ID_INVITED
     ```

4. Run the application:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

For production, use `npm run build` and deploy accordingly.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

Ensure code quality with linting and add tests where possible.

## Contact

- **Author**: Uncledev
- **Repository**: [https://github.com/uncleedev/sborr](https://github.com/uncleedev/sborr)
- **Issues**: [GitHub Issues](https://github.com/uncleedev/sborr/issues)

For questions, please open an issue or contact the maintainer.
