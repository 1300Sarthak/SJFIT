#!/usr/bin/env python
# coding: utf-8
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data')
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

app.run(debug=True, port=8000)
# ### Install and Import Dependencies
''' UNCOMMENT LATER

# In[2]:


get_ipython().system('pip install opencv-python')


# In[4]:


pip install mediapipe-model-maker==0.2.1.3


# In[5]:


import cv2
import mediapipe as mp
import numpy as np
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


# ### Make Detections

# ### Determining Joints

# <img src="https://i.imgur.com/3j8BPdc.png" style="height:300px" >

# In[6]:


#landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility


# In[7]:


#landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]


# In[8]:


#landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]


# In[9]:


#landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]


# In[10]:


#landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]


# ### Calculate Angles

# In[11]:


def calculate_angle(a,b,c):
    a = np.array(a) # First
    b = np.array(b) # Mid
    c = np.array(c) # End
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle >180.0:
        angle = 360-angle
        
    return angle 


# ### Double Arm Shoulder Press Counter

# In[13]:


cap = cv2.VideoCapture(0)

# Curl counter variables
Lcounter = 0 
Rcounter = 0
Lstage = None
Rstage = None

## Setup mediapipe instance
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        
        # Recolor image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
      
        # Make detection
        results = pose.process(image)
    
        # Recolor back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Extract landmarks
        try:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates
            Lshoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            Lelbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            Lwrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            # Get coordinates
            Rshoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            Relbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            Rwrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
            
            # Calculate angle
            Langle = calculate_angle(Lshoulder, Lelbow, Lwrist)
             # Calculate angle
            Rangle = calculate_angle(Rshoulder, Relbow, Rwrist)
            
            
            # Visualize angle
            cv2.putText(image, str(Langle), 
                           tuple(np.multiply(Lelbow, [640, 480]).astype(int)), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
                                )
            # Visualize angle
            cv2.putText(image, str(Rangle), 
                           tuple(np.multiply(Relbow, [640, 480]).astype(int)), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
                       )
            
              

            # Curl counter logic
            if Langle > 160:
                Lstage = "down"
            elif Langle < 30 and Lstage =='down':
                Lstage="up"
                Lcounter +=1
                print(Lcounter)

            if Rangle > 160:
                Rstage = "down"
            elif Rangle < 30 and Rstage =='down':
                Rstage="up"
                Rcounter +=1
                print(Rcounter)
                
         
                       
        except:
            pass
        
        # Render curl counter
        # Setup status box
        cv2.rectangle(image, (0,0), (225,73), (245,117,16), -1)
        
        # Rep data
        cv2.putText(image, 'REPS', (15,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, str(Lcounter), 
                    (10,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)
        
        cv2.rectangle(image, (2000,0), (1600,73), (245,117,16), -1)
        cv2.putText(image, 'REPS', (15,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, str(Rcounter), 
                    (1800,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)
        
        # Stage data
        cv2.putText(image, 'STAGE', (65,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, Lstage, 
                    (60,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)
        cv2.putText(image, 'STAGE', (65,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, Rstage, 
                    (1620,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)    
        
        # Render detections
        if (Lstage == "up"):
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(0,0,0), thickness=3, circle_radius=2), 
                                mp_drawing.DrawingSpec(color=(230,0,110), thickness=2, circle_radius=2) 
                                )  
        if (Rstage == "up"):
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(0,0,0), thickness=3, circle_radius=2), 
                                mp_drawing.DrawingSpec(color=(230,110,0), thickness=2, circle_radius=2) 
                                )  
        if (Rstage == "down" and Lstage == "down"):
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(0,0,0), thickness=3, circle_radius=2), 
                                mp_drawing.DrawingSpec(color=(230,0,0), thickness=2, circle_radius=2) 
                                )  
        if (Rstage == "up" and Lstage == "up"):
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(0,0,0), thickness=3, circle_radius=2), 
                                mp_drawing.DrawingSpec(color=(230,110,110), thickness=2, circle_radius=2) 
                                )  
            
            
        cv2.imshow('Mediapipe Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    for i in range (1,5):
        cv2.waitKey(1)


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




'''