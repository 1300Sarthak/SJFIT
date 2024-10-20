# SJFIT.AI

**SJFit.Ai** is designed for San Jose State University students and anyone looking to lead a fit lifestyle. This application tracks users' physical activity by analyzing joint angles. By implementing APIs such as MediaPipe, OpenCV, and AI algorithms, SJFit.Ai automatically counts workout repetitions during the user's exercise routines.

## SJFit.Ai in Action

Here's a demonstration of SJFit.Ai tracking physical activity using joint angle detection.

[![SJFit.Ai Demo](https://img.youtube.com/vi/O573Yx7XA5g/0.jpg)](https://www.youtube.com/watch?v=O573Yx7XA5g)

Click on the image above to watch the video demo on YouTube.


## What it Does

**SJFit.Ai** was designed for San Jose State University students and anyone interested in leading a fit lifestyle. The application tracks users' physical activity by analyzing joint angles. By implementing APIs such as MediaPipe, OpenCV, and Artificial Intelligence, SJFit.Ai accurately counts the number of repetitions performed during workout sets. The system is designed to track exercises like squats, shoulder presses, curls, and lateral raises, giving users real-time feedback on their workout performance.

## How We Built It

SJFit.Ai was developed using the following tools and technologies:

- **MediaPipe API** for joint angle tracking and physical movement detection.
- **OpenCV API** for image processing and video capture.
- **Python** as the primary programming language.
- **Jupyter Lab** for developing and testing the Python-based AI and computer vision models.

## Challenges We Ran Into

One of the major challenges we faced was getting MediaPipe to run on Apple silicon CPUs (M1 and M2), which required a lot of debugging and troubleshooting. Another issue was achieving consistent accuracy in movement tracking. Initially, the app did not track movements with 100% precision, leading to further refinement of the algorithms.

## Accomplishments We're Proud Of

We are proud to have overcome the hardware challenges and build SJFit.Ai to be 95% accurate in tracking exercises, even though we had limited time. This is a significant accomplishment, and we plan to improve the accuracy even further with more development time.

## What We Learned

During the development of SJFit.Ai, we learned a lot about:

- Using Git for version control and collaboration.
- The functionality of **MediaPipe** and its interaction with different hardware systems.
- Working with **Jupyter Lab**, Python, and integrating APIs for computer vision tasks.
- Debugging and troubleshooting cross-platform compatibility issues.

## What's Next for SJFit.Ai

Our future plans for SJFit.Ai include:

- Expanding the application into full-fledged mobile apps for **iOS** and **Android**.
- Developing a web-based version that allows users to access SJFit.Ai from anywhere, whether at home or on the go.

## Hackathon Experience

SJFit.Ai was built at a 24-hour hackathon called **Silicon Hacks**. Despite the time constraints, our team managed to complete the project and submit it successfully. We are proud to announce that **SJFit.Ai won 2nd place** in the competition! You can learn more about the hackathon at [Silicon Hacks](https://siliconxhacks.devpost.com/).











## Use the Project Yourself!

Follow these instructions to set up the project on your local machine for development and testing purposes. For deployment notes on live systems, see the section below.

### Prerequisites

You'll need the following software installed before running the project:

- Python 3.x
- OpenCV (`pip install opencv-python`)
- MediaPipe (`pip install mediapipe`)
- TensorFlow (`pip install tensorflow`)
- Flask (for the web app) (`pip install flask`)

pip install opencv-python mediapipe tensorflow flask


### Installing

Follow this step-by-step guide to set up a development environment:

1. **Clone the repository:**

git clone https://github.com/1300sarthak/SJFit.git


2. **Navigate to the project directory:**

cd SJFit.Ai


3. **Install the required dependencies:**

pip install -r requirements.txt


4. **Run the application locally:**

python app.py


5. **Test the joint tracking:**
The application will start analyzing user movements and count the repetitions for basic exercises such as squats, curls, shoulder presses, and lateral raises. Below is the status of the various exercise tracking files:

- **LatRaiseFitAI-BothArms.ipynb (In Progress):** Currently tracks lateral raises and is under development.
- **CurlFitAI-BothArms.ipynb (Works):** Successfully tracks curls, with the functionality to change colors when doing reps.
- **ShoulderPressFitAI-BothArms.ipynb (Works):** Tracks shoulder presses and includes color changes during reps. Squat functionality was also added.
- **SquatFitAI.ipynb (Works):** Tracks squats and includes color changes during reps.
- **FitAI.ipynb & simplifiedFitAI.ipynb:** Provide overall fitness tracking features and numbers, simplifying the interface for basic functionalities.

Repeat steps 1-4 until fully set up.

## Running the tests

To run automated tests for the system, use the following commands.

### Break down into end-to-end tests

These tests validate the integration of all modules, ensuring that physical activity tracking works correctly end-to-end. This includes testing joint angle detection and repetition counting.

python test_end_to_end.py


### Coding style tests

Ensure that the code adheres to PEP8 coding standards. This improves readability and maintainability.

flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics


## Deployment

To deploy SJFit.Ai on a live system, follow these steps:

1. Deploy the Flask web app using a platform like Heroku or AWS.
2. Ensure that the MediaPipe and OpenCV libraries are correctly installed on the server.
3. Add environment variables for API keys if applicable.

## Built With

* [MediaPipe](https://mediapipe.dev/) - API for joint angle tracking
* [OpenCV](https://opencv.org/) - Library for image processing
* [TensorFlow](https://www.tensorflow.org/) - AI and ML functionality
* [Flask](https://flask.palletsprojects.com/) - Web framework


## Authors

* **Sarthak Sethi** - [GitHub](https://github.com/1300Sarthak)
* **Edwin** - [GitHub](https://github.com/edwaddle)
* **Samson** - [GitHub](https://github.com/xusamson8)
  
## Acknowledgments

* Thanks to the San Jose State University student community for testing the app.
* Shout out to the open-source community for developing MediaPipe and OpenCV.
* Inspiration from fitness tracking platforms like Fitbit and Apple Health.
