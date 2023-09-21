# FRC 5587 - Titan Robotics - Hour Logging System
## Functionality:
- Register users with their student ID for easy sign-in
- Quick user lookup
- Google Sheets integration
- Automatic behind-the-scenes authentication

## Setup:
- Clone the project or download the zip from GitHub.
- Open the folder in a terminal and run `npm i`
- Once install finishes, run `npm run start` to start a live development server OR with the `serve` package installed, run `npm run build` and then `serve -s build -l 3000` to start a production server. **NOTE:** running build on the Raspberry Pi takes a lot of ram and energy, so it may crash before it finishes. The live development server or building on a separate device are recommended.