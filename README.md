## Links
Back-end: [repository](https://github.com/willy-it-wonka/Bookshelf-backend)\
Demo: [AWS](http://bookshelf-app.s3-website.eu-north-1.amazonaws.com)
</br></br>

## Tech stack
<img src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png" width="45px" height="auto" alt="Angular 17">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" width="45px" height="auto" alt="TypeScript">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" width="45px" height="auto" alt="HTML">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" width="45px" height="auto" alt="CSS">&nbsp;&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/25181517/183898054-b3d693d4-dafb-4808-a509-bab54cf5de34.png" width="45px" height="auto" alt="Bootstrap">
</br></br>

## Installation
1. Run the [back-end](https://github.com/willy-it-wonka/Bookshelf-backend) of this application.
2. Clone the repository. [Instruction](https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/with-visual-studio-code/clone-github-repository?tabs=integrated-terminal#clone-repository).
3. To install all dependencies, type in the VSC terminal:
   ```bash
   npm install
   ```
4. CAPTCHA verification has been implemented in the registration and contact form. Instructions for use are included in the comments in the files: register.component and contact.component.
5. Contact form works with [EmailJS](https://www.emailjs.com/). Instructions are in the comments in contact.component.
6. To use the application through the browser, type in the VSC terminal:
   ```bash
   ng serve
   ```
</br>

## Description
Your virtual library.\
With this application you can manage your library. Create a reading schedule. Keep a record of what you read and when. Write down notes and conclusions about the books you have read.
</br>
* registration and login
* sending confirmation email
* JWT authorization
* CRUD books, notes
* contact form using EmailJS
* reCAPTCHA
* route guard
* unit testing
</br></br>

## Future features
* Reading schedule.
* Formatting text in notes.
