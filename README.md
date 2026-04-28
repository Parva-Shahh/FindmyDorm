# FindmyDorm
Repository for the FindmyDorm project; a website to compare dorms in Ireland

FindMyDorm: International Student Housing Platform

Project Overview & Problem Statement
The vision of the project

A localized housing platform called FindMyDorm was developed especially to assist international students looking for housing in a foreign nation. By putting students in direct contact with classmates who already reside in the dorms the platform aims to foster a feeling of community among students rather than concentrating only on listings and transactions. The idea is to help students find a place to live where they feel informed at ease and accepted rather than just finding a room. FindMyDorm emphasizes student-to-student interaction in contrast to generic housing and booking websites that frequently lack transparency or cultural context. Authentic peer reviews verified resident profiles and first-hand accounts of everyday life in the dorms are highlighted on the platform.

Technical Architecture and Implementation

Python and Flask are used in the development of the application which has a modular architecture intended to support intricate internationalization requirements in a clear and scalable manner. This structure enables the system to support various languages and regional behaviors while maintaining maintainability. The project makes use of the App Factory pattern to accomplish this and an __init__ . py file handles initialization. In order to prevent circular dependencies between routing logic and the translation engine this method was specifically chosen to manage the lifecycle of both the Flask application and Flask Babel. Additionally it guarantees that the applications internationalization tools are available everywhere. A session-based method is used to handle localization dynamically. Users can switch between languages at any time and the session saves their preferred language. To ensure a smooth multilingual experience a custom get_locale() function on the backend looks for this stored preference and in the absence of an explicit choice reverts to the users browser locale. I added data normalization logic to handle non-standard locale inputs in order to increase system reliability even more. For instance ISO-compliant language codes like zh correspond to user-friendly region codes like CN. This ensures consistent loading of accurate translation catalogs (dot mo files) and avoids site-wide language resolution errors.

Cultural Adaptation & UX Strategy

