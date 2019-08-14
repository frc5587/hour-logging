# Hour Logging

## Setup

1. Install NodeJS. For Raspberry Pi, use the instructions from [here](https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/), replacing "10.x" with the most recent variant of NodeJS
2. Install all of the Node dependencies for this project:

```bash
npm install
```

3. Install MySQL, using [this guide](https://pimylifeup.com/raspberry-pi-mysql/) for Raspberry Pi instructions.
4. Create a new database and a students table in it, updating fields in angle brackets with your information:

```sql
CREATE DATABASE hour_logging;

USE hour_logging;

CREATE TABLE students(
    `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` int(9) UNSIGNED NOT NULL,
    `student_name` varchar(255) NOT NULL,
    `minutes` mediumint(255) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`)
);
```

5. Set up the user profile for MySQL and grant it the necessary privileges, refreshing MySQL's privileges afterwards:

```sql
CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';

GRANT SELECT, UPDATE ON hour_logging.students TO `<username>`@`localhost`;

FLUSH PRIVILEGES;
```

6. Update [`src/credentials.json`](src/credentials.json) with the information you used when setting up the SQL server in steps 4 and 5.

## Start the Application

First, build the frontend:

```bash
npm run build
```

Then, to run the server that exposes the student hours data and serve the generated frontend build, use

```bash
npm run start
```

## Developing

To run the backend server and the Vue development server, simply run

```bash
npm run dev
```

From there, whenever you edit a file, Node or Vue will update the backend and frontend respectively without you needing to restart anything.

For reference, the server is strictly contained in [`src/server.js`](src/server.js) and interacts with [`src/credentials.json`](src/credentials.json), while the rest of the code in the `src/` directory and its subdirectories are for the Vue frontend.
