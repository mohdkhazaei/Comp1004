# COMP1004 Image Enhancement SPA

Welcome to the Image Enhancement Tool repository! This academic project presents a comprehensive web application designed for image enhancement tasks, including AI-based upscaling, Image format conversion, and a user-specific gallery for image management. It integrates user authentication for personal account management, leveraging Firebase's cloud storage and cloud database, DeepAI's API for AI upscaling capabilities, and ByteScale's API for Image processing.

## Features

- **User Authentication**: Offers login and signup functionalities for personalized user experiences, utilizing Firebase Authentication.
- **AI Image Upscaler**: Employs DeepAI's superresolution AI model for image upscaling, enhancing image resolution and detail.
- **Image Format Conversion**: Allows users to convert images into various formats, ensuring flexibility and quality preservation or reduction for image memory size adjustment.
- **User Image Gallery**: Users can access a personal gallery to view, download, or delete their uploaded images, facilitated by Firebase Firestore and Storage.
- **Responsive Design**: The application is designed to be responsive, providing a consistent experience across various devices.

## Technology Stack

- **Frontend**: The application is built using HTML, CSS, and JavaScript, creating a dynamic and responsive interface.
- **Backend Services**:
  - **Firebase**: Utilizes Firebase Authentication, Firestore, and Storage for handling user data, authentication, and image storage.
  - **DeepAI API**: Powers the AI image upscaling feature, enhancing image quality through advanced algorithms.
  - **ByteScale API**: Powers the Image processing features, converting image formats and adjusting image quality for image compatibality with different platforms

## Project Setup

The project is ready to run out of the box, with all necessary configurations, including API keys and Firebase CDN integrations, directly included within the project files.

1. **Clone the Repository**: Clone this repository to your local machine to get started.
2. **Open the Project**: Load the files in your preferred code editor (ideally visual studio code) and download the live server extension and run via the extension to start exploring the functionalities of the Image Enhancement Tool.
   
    ![image](https://github.com/mohdkhazaei/Comp1004/assets/105325272/804041f7-a86b-41da-933d-20ec45c21454)
   
4. **alternativly**: use this link to access the SPA directly via Vercel where its hosted " https://comp1004-oziaqshk0-mohdkhazaeis-projects.vercel.app/ ".
5. note: the AI upscaling works better on blurry/drawn images
   
![Screenshot 2024-04-20 084404](https://github.com/mohdkhazaei/Comp1004/assets/105325272/d2f4e635-6984-475c-b9ee-7f4a2f96b2d0)


## Project Structure

- **`index.html`**: The main file that contains the HTML structure of the application, organizing various functionalities and sections.
- **`styles.css`**: Defines the styling for the application, ensuring an attractive and responsive layout.
- **`UIManager.js`**: Manages user interactions with the application, handling UI updates, and event listeners.
- **`firebase-config.js`**: Contains the initialization and configuration for Firebase services, leveraging the Firebase CDN for seamless integration.

## Academic Purpose

This project is developed as a part of a school assignment with the aim to demonstrate the application of web development skills in creating a practical single paged web application.

## Acknowledgments

- **ByteScale API**: For providing the Image processing API, enabling the application to adjust image quality and convert image formats effectively.
- **DeepAI**: For providing the AI upscaling API, enabling the application to enhance image quality effectively.
- **Firebase**: For offering a comprehensive set of backend services that facilitate user authentication, data storage, and image management.
- **Instructor and Classmates**: For their invaluable feedback and support throughout the development process, contributing to the project's completion and refinement.

