## Links
Back-end: [repository](https://github.com/willy-it-wonka/Bookshelf-backend)\
Demo: [AWS](https://d39oa1kkhfrmo.cloudfront.net)\
Example data for the database: [repository](https://github.com/willy-it-wonka/Bookshelf-database)
</br></br>

## Tech stack
<img src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png" width="50px" height="auto" alt="Angular 17">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" width="50px" height="auto" alt="TypeScript">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" width="50px" height="auto" alt="HTML">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" width="50px" height="auto" alt="CSS">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183898054-b3d693d4-dafb-4808-a509-bab54cf5de34.png" width="50px" height="auto" alt="Bootstrap">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png" width="50px" height="auto" alt="git">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183896132-54262f2e-6d98-41e3-8888-e40ab5a17326.png" width="50px" height="auto" alt="aws">
</br></br>

## Installation
1. Run the [back-end](https://github.com/willy-it-wonka/Bookshelf-backend) of this application.
2. Clone the repository. [Instruction](https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/with-visual-studio-code/clone-github-repository?tabs=integrated-terminal#clone-repository).
3. To install all dependencies, type in the VSC terminal:
   ```
   npm install
   ```
4. CAPTCHA verification has been implemented in the registration and contact form. Instructions for use are included in the comments in the file: environment.ts
5. Contact form works with [EmailJS](https://www.emailjs.com/). Instructions are in the comments in environment.ts
6. To use the application through the browser, type in the VSC terminal:
   ```
   ng serve
   ```
</br>

## Description
Your virtual library.\
With this application you can manage your library. Create a reading schedule. Keep a record of what you read and when. Write down notes and conclusions about the books you have read.
</br>
* registration and login
* user account management
* sending confirmation email
* JWT authorization
* CRUD operations
* contact form using EmailJS
* reCAPTCHA
* route guard
* unit testing
</br></br>

## Future features
* Reading schedule.
* Formatting text in notes.
